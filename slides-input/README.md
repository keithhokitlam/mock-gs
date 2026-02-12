# Slides Input for Food Category

Drop your exported PowerPoint slide images here.

## Workflow

1. **Export slides from PowerPoint**
   - File → Export → Images (PNG/JPG), or
   - File → Save As → choose "PNG" or "JPEG"

2. **Place the exported images** in this folder (`slides-input/`)

3. **Process the slides** — either:
   - Ask Cursor: *"Take the slides from slides-input/ and add them to the food category page"*, or
   - Run: `npm run process-slides`

4. **Rebuild/redeploy** — run `npm run build` (or push to trigger deploy) so the food category page picks up the new images.

Images will appear on the [/foodcategory](/foodcategory) page.
