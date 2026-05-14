import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const markdownRoots = ["README.md", "docs", "research", "prototypes"];
const markdownFiles = markdownRoots.flatMap((entry) => collectMarkdownFiles(join(projectRoot, entry)));
const checkedLinks = [];
const failures = [];

for (const filePath of markdownFiles) {
  const content = readFileSync(filePath, "utf8");
  for (const link of extractMarkdownLinks(content)) {
    if (shouldSkipLink(link)) {
      continue;
    }
    const targetPath = stripAnchor(link);
    if (!targetPath) {
      continue;
    }
    const resolvedTarget = resolve(dirname(filePath), targetPath);
    checkedLinks.push(toProjectRelative(filePath, link));
    if (!isInsideProject(resolvedTarget) || !existsSync(resolvedTarget)) {
      failures.push({
        file: toProjectRelativePath(filePath),
        link,
        resolvedTarget: toProjectRelativePath(resolvedTarget)
      });
    }
  }
}

const manifestPath = join(projectRoot, "research", "reference-manifest.json");
const manifestEntries = JSON.parse(readFileSync(manifestPath, "utf8"));
assert.ok(Array.isArray(manifestEntries), "reference-manifest.json must contain an array");

for (const [index, entry] of manifestEntries.entries()) {
  assert.equal(typeof entry.role, "string", `manifest entry ${index} role must be a string`);
  assert.equal(typeof entry.target, "string", `manifest entry ${index} target must be a string`);
  assert.ok(
    !looksLikeAbsoluteHostPath(entry.target),
    `manifest entry ${index} target must be project-relative: ${entry.target}`
  );
  if (typeof entry.source === "string" && looksLikeAbsoluteHostPath(entry.source)) {
    failures.push({
      file: toProjectRelativePath(manifestPath),
      link: entry.source,
      resolvedTarget: "source should be sourceNote or a project-relative path"
    });
  }
  const resolvedTarget = resolve(projectRoot, entry.target);
  checkedLinks.push({ file: toProjectRelativePath(manifestPath), link: entry.target });
  if (!isInsideProject(resolvedTarget) || !existsSync(resolvedTarget)) {
    failures.push({
      file: toProjectRelativePath(manifestPath),
      link: entry.target,
      resolvedTarget: toProjectRelativePath(resolvedTarget)
    });
  }
}

if (failures.length > 0) {
  console.error(JSON.stringify({ ok: false, failures }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      markdownFiles: markdownFiles.map(toProjectRelativePath),
      checkedLinkCount: checkedLinks.length,
      manifestEntryCount: manifestEntries.length
    },
    null,
    2
  )
);

function collectMarkdownFiles(path) {
  if (!existsSync(path)) {
    return [];
  }
  const stats = statSync(path);
  if (stats.isFile()) {
    return extname(path).toLowerCase() === ".md" ? [path] : [];
  }
  if (!stats.isDirectory()) {
    return [];
  }
  return readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
    const childPath = join(path, entry.name);
    if (entry.isDirectory()) {
      return collectMarkdownFiles(childPath);
    }
    return entry.isFile() && extname(entry.name).toLowerCase() === ".md" ? [childPath] : [];
  });
}

function extractMarkdownLinks(content) {
  const links = [];
  const linkPattern = /(?<!!)\[[^\]]+\]\(([^)]+)\)/g;
  for (const match of content.matchAll(linkPattern)) {
    links.push(match[1].trim().replace(/^<|>$/g, ""));
  }
  return links;
}

function shouldSkipLink(link) {
  return /^(https?:|mailto:|#)/i.test(link);
}

function stripAnchor(link) {
  return decodeURIComponent(link.split("#")[0].trim());
}

function looksLikeAbsoluteHostPath(value) {
  return /^[A-Za-z]:[\\/]/.test(value) || value.startsWith("\\\\") || value.startsWith("/");
}

function isInsideProject(path) {
  const projectRelative = relative(projectRoot, path);
  return projectRelative === "" || (!projectRelative.startsWith("..") && !isAbsolute(projectRelative));
}

function toProjectRelative(filePath, link) {
  return { file: toProjectRelativePath(filePath), link };
}

function toProjectRelativePath(filePath) {
  return resolve(projectRoot, filePath).startsWith(projectRoot)
    ? resolve(projectRoot, filePath).slice(projectRoot.length + 1).replaceAll("\\", "/") || "."
    : filePath;
}
