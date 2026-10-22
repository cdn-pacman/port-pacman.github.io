# Star UI Community CDN — Website Template

A responsive ROM download page inspired by modern Android ROM CDN pages. Built with plain HTML, CSS and JavaScript for GitHub Pages.

## Files
- `index.html` — page structure
- `style.css` — responsive dark theme and layout
- `script.js` — device selector and release history rendering
- `data/roms.json` — edit this file to add your devices and ROM releases

## Publish with GitHub Pages
1. Create a GitHub repository (for example, `starui-cdn`).
2. Upload **all files and folders** from this ZIP. Keep `data/roms.json` inside the `data` folder.
3. Open repository **Settings → Pages**.
4. Under Build and deployment, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then save.
6. Wait for GitHub to publish the site. The URL appears in Settings → Pages.

## Add your real ROM build
Edit `data/roms.json`. For the latest release, replace:
- `date`: actual release date
- `summary`: release notes
- `downloadUrl`: direct ROM file or trusted download page
- `changelogUrl`: changelog URL
- `sourceUrl`: your source repository URL
- `status`: e.g. `STABLE`, `BETA`, or `ALPHA`

The first object in each device's `builds` array is shown as the latest build. Add older releases after it.

Example:
```json
{
  "version": "Alpha V2",
  "android": "Android 15",
  "securityPatch": "2026-09-05",
  "date": "2026-10-22",
  "type": "Fastboot Only",
  "summary": "Your release notes here.",
  "downloadUrl": "https://example.com/your-rom.zip",
  "changelogUrl": "https://github.com/YOUR-USERNAME/YOUR-REPOSITORY/releases",
  "sourceUrl": "https://github.com/YOUR-USERNAME/YOUR-REPOSITORY",
  "status": "ALPHA"
}
```

## Important
- All URLs in the sample data are placeholders. Replace them before sharing the website.
- This is a frontend template; it does not upload ROM files or automatically detect new GitHub releases.
- For real automatic build history, connect GitHub Actions or the GitHub Releases API in a later step.
