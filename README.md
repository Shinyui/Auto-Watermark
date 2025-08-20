# Auto Watermark

A Node.js script that automatically adds watermarks to images and videos using FFmpeg.

## Features

- Supports both images and videos
- Random watermark positioning in four corners
- Preserves original video audio
- Batch processing of multiple files
- Support for common formats: MP4, MOV, AVI, MKV, JPG, JPEG, PNG

## Prerequisites

- Node.js installed
- FFmpeg installed on your system
- Required npm packages: `fluent-ffmpeg`

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Make sure FFmpeg is installed and accessible in your PATH
   If FFmpeg is not in PATH, uncomment and modify the path in `index.js`:
   ```javascript
   ffmpeg.setFfmpegPath("/path/to/your/ffmpeg");
   ```

## Configuration

Before running the script, update the following constants in `index.js`:

```javascript
const INPUT_DIR = "path/to/your/input/folder";
const OUTPUT_DIR = "path/to/your/output/folder";
const WATERMARK = "path/to/your/watermark/image";
```

## Watermark Recommendations

- **For Photos**: Use `watermark4x.png` for better quality on high-resolution images
- **For Videos**: Use `watermark2x.png` for optimal balance between quality and file size
- **Alternative**: `watermark3x.png` available for medium resolution needs

## Usage

1. Place your images and videos in the input directory
2. Configure the paths in `index.js`
3. Run the script:
   ```bash
   node index.js
   ```

## How It Works

1. The script scans the input directory for supported file formats
2. For each file, it randomly selects one of four corner positions for the watermark
3. Images are processed as single frames
4. Videos are processed with audio preservation
5. Output files are saved with a "wm_" prefix

## Watermark Positions

The script randomly places watermarks in one of these positions:
- Top-left corner
- Top-right corner
- Bottom-left corner
- Bottom-right corner

## Output

Processed files will be saved in the output directory with the following naming convention:
- Original: `example.jpg`
- Watermarked: `wm_example.jpg`

## Troubleshooting

- If you encounter FFmpeg path issues, manually set the path using `ffmpeg.setFfmpegPath()`
- Ensure your watermark image has transparency (PNG format recommended)
- Check that input and output directories exist and have proper permissions

## License

This project is open source and available under the MIT License.