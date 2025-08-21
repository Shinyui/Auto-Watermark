# Auto Watermark CLI

A command-line tool that automatically adds watermarks to images and videos using FFmpeg.

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

### Local Installation
1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Make the script executable:
   ```bash
   chmod +x index.js
   ```

### Global Installation
1. Install globally from the project directory:
   ```bash
   npm install -g .
   ```
2. Or install directly from npm (if published):
   ```bash
   npm install -g auto-watermark
   ```

### Prerequisites
- Node.js (>= 12.0.0)
- FFmpeg installed and accessible in your PATH
  - If FFmpeg is not in PATH, use the `--ffmpeg-path` option

## CLI Usage

### Basic Usage
```bash
auto-watermark -i /path/to/input -o /path/to/output -w /path/to/watermark.png
```

### Options
- `-i, --input <directory>` - Input directory containing images/videos (required)
- `-o, --output <directory>` - Output directory for watermarked files (required)
- `-w, --watermark <file>` - Watermark image file path (required)
- `-p, --position <position>` - Watermark position (optional, default: random)
  - `tl` - Top-left
  - `tr` - Top-right
  - `bl` - Bottom-left
  - `br` - Bottom-right
  - `random` - Random position (default)
- `--ffmpeg-path <path>` - Custom FFmpeg binary path (optional)
- `-h, --help` - Display help information
- `-V, --version` - Display version number

## Watermark Recommendations

- **For Photos**: Use `watermark4x.png` for better quality on high-resolution images
- **For Videos**: Use `watermark2x.png` for optimal balance between quality and file size
- **Alternative**: `watermark3x.png` available for medium resolution needs

### Examples

1. **Basic watermarking with random position:**
   ```bash
   auto-watermark -i ./input -o ./output -w ./watermark/watermark2x.png
   ```

2. **Watermark in top-right corner:**
   ```bash
   auto-watermark -i ./input -o ./output -w ./watermark/watermark4x.png -p tr
   ```

3. **With custom FFmpeg path:**
   ```bash
   auto-watermark -i ./input -o ./output -w ./watermark.png --ffmpeg-path /usr/local/bin/ffmpeg
   ```

4. **Local execution (without global install):**
   ```bash
   node index.js -i ./input -o ./output -w ./watermark.png
   ```

## How It Works

1. The script scans the input directory for supported file formats
2. For each file, it randomly selects one of four corner positions for the watermark
3. Images are processed as single frames
4. Videos are processed with audio preservation
5. Output files are saved with a "wm_" prefix

## Watermark Positions

You can specify watermark position using the `-p` option:
- `tl` - Top-left corner
- `tr` - Top-right corner
- `bl` - Bottom-left corner
- `br` - Bottom-right corner
- `random` - Randomly selects one of the above (default)

## Output

Processed files will be saved in the output directory with the following naming convention:
- Original: `example.jpg`
- Watermarked: `wm_example.jpg`

## Troubleshooting

- **FFmpeg not found**: Use the `--ffmpeg-path` option to specify the full path to your FFmpeg binary
- **Permission errors**: Ensure you have read access to input directory and write access to output directory
- **No files processed**: Check that your input directory contains supported file formats
- **Watermark not visible**: Ensure your watermark image has transparency (PNG format recommended)
- **Global command not found**: After global installation, restart your terminal or run `npm link` in the project directory

## License

This project is open source and available under the MIT License.