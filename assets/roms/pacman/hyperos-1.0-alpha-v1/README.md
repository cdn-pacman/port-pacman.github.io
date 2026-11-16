Add screenshots for the HyperOS-1.0 Alpha V1 Pacman ROM in this folder.

After uploading the image file, add its path to the `screenshots` array in `data/roms.json`, for example:

```json
"screenshots": [
  "assets/roms/pacman/hyperos-1.0-alpha-v1/screenshot-01.jpg",
  "assets/roms/pacman/hyperos-1.0-alpha-v1/screenshot-02.jpg"
]
```

Keep screenshots for each ROM version in its own folder. GitHub Pages cannot automatically list files in a folder, so the JSON manifest must list each screenshot path. ROM download links and details are also managed in `data/roms.json`.
