# CPU procedural prototype

This folder preserves the first local procedural simulation attempt copied from Downloads.

The prototype intentionally does not include YouTube live streaming. It exists only to evaluate visual direction and rendering constraints.

Current known issue: the broad cumulonimbus outline is acceptable, but fine billow detail, volumetric depth, and physically plausible self-shadowing need substantial improvement.

Files:

- [cumulonimbus_proc_preview.py](cumulonimbus_proc_preview.py)
- [cumulonimbus_proc_preview.mp4](cumulonimbus_proc_preview.mp4)

Run locally from the project root with Python and FFmpeg available:

```powershell
python .\prototypes\cpu-procedural\cumulonimbus_proc_preview.py
```
