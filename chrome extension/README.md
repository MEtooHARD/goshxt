# NDHU Course Registration Helper - Chrome Extension

A Chrome extension to assist with NDHU (National Dong Hwa University) course registration.

## Features

- **Fetch Courses**: Scan and collect all available course registration buttons
- **Execute**: Execute all collected course registrations in one click
- **Visual Feedback**: Toast notifications and status updates

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `chrome-extension` folder
5. The extension is now installed!

## Usage

1. Navigate to the NDHU course registration page
2. You'll see a control panel in the bottom-right corner
3. Click **"Fetch Courses"** to scan all available courses
4. Click **"Execute"** to register for all courses at once

## Files

- `manifest.json` - Extension configuration
- `content.js` - Main script injected into registration page
- `popup.html` - Extension popup UI
- `README.md` - This file

## Development

To modify the extension:
1. Edit the files in this directory
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Reload the registration page to see changes

## Notes

- No automatic timing - you control when to fetch and execute
- All operations happen in the browser (no backend needed)
- Lightweight and fast
