# Slides Input for Food Category

Drop your exported PowerPoint slide images here.

## Best Quality Export Settings

To keep slides sharp on the web app:

1. **Use PNG** (lossless) — better than JPEG for slides with text and graphics.
2. **Export at high resolution:**
   - **Mac:** File → Export → PNG → when prompted, use **width: 1920** and **height: 1080** (or higher, e.g. 2560×1440).
   - **Windows:** File → Save As → PNG. For higher DPI, [set ExportBitmapResolution](https://learn.microsoft.com/en-us/office/troubleshoot/powerpoint/change-export-slide-resolution) in Registry to 300 (or 600 for max quality).
3. **Avoid JPEG** unless file size is critical — JPEG compression blurs text and sharp edges.

## Workflow

1. **Export slides** from PowerPoint using the settings above.

2. **Place the exported images** in this folder (`slides-input/`) or a subfolder (e.g. `slides-input/My Category/`)

3. **Process the slides** — either:
   - Ask Cursor: *"Take the slides from slides-input/ and add them to the food category page"*, or
   - Run: `npm run process-slides`

4. **Rebuild/redeploy** — run `npm run build` (or push to trigger deploy) so the food category page picks up the new images.

Images will appear on the [/foodcategory](/foodcategory) page.
