# media/ folder

Drop short example video clips in this folder, using these exact filenames
(matching each built-in scenario ID):

- cup_break.mp4
- egg_crack.mp4
- bird_window.mp4
- bus_arrives.mp4
- ipad_stuck.mp4

Requirements:
- Format: MP4 with H.264 video encoding (this is the most broadly
  compatible option across browsers/devices — HEVC/H.265, common on
  iPhone, will fail silently and just fall back to the pictogram icon).
- Keep clips short (a few seconds) and file sizes small — GitHub has a
  100MB hard limit per file, and large videos slow down page loads.

If a scenario's file is missing, the game falls back to its built-in
pictogram icon automatically — nothing breaks.

Any teacher can still override any of these (or ones you didn't provide)
by uploading their own video through Teacher Settings on their own
device; their upload always takes priority over whatever's in this
folder, but only on that specific device/browser.
