const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const { Command } = require("commander");

const program = new Command();

program
  .name('auto-watermark')
  .description('Automatically add watermarks to images and videos')
  .version('1.0.0')
  .requiredOption('-i, --input <directory>', 'Input directory containing images/videos')
  .requiredOption('-o, --output <directory>', 'Output directory for watermarked files')
  .requiredOption('-w, --watermark <file>', 'Watermark image file path')
  .option('-p, --position <position>', 'Watermark position: tl (top-left), tr (top-right), bl (bottom-left), br (bottom-right), random (default)', 'random')
  .option('--ffmpeg-path <path>', 'Custom FFmpeg binary path')
  .parse();

const options = program.opts();

// Set custom FFmpeg path if provided
if (options.ffmpegPath) {
  ffmpeg.setFfmpegPath(options.ffmpegPath);
}

const INPUT_DIR = options.input;
const OUTPUT_DIR = options.output;
const WATERMARK = options.watermark;
const POSITION_MODE = options.position;

// Validate input arguments
if (!fs.existsSync(INPUT_DIR)) {
  console.error(`❌ Input directory does not exist: ${INPUT_DIR}`);
  process.exit(1);
}

if (!fs.existsSync(WATERMARK)) {
  console.error(`❌ Watermark file does not exist: ${WATERMARK}`);
  process.exit(1);
}

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Filter supported files (videos + images)
const files = fs.readdirSync(INPUT_DIR).filter(f =>
  f.match(/\.(mp4|mov|avi|mkv|jpg|jpeg|png)$/i)
);

if (files.length === 0) {
  console.log('📁 No supported files found in input directory.');
  process.exit(0);
}

console.log(`🎯 Found ${files.length} file(s) to process`);

// Define coordinates for four corners
const positions = {
  tl: { x: "10", y: "10" },  // Top-left
  tr: { x: "main_w-overlay_w-10", y: "10" }, // Top-right
  bl: { x: "10", y: "main_h-overlay_h-10" }, // Bottom-left
  br: { x: "main_w-overlay_w-10", y: "main_h-overlay_h-10" } // Bottom-right
};

const positionKeys = Object.keys(positions);

// Function to get position based on user preference
function getPosition(mode) {
  if (mode === 'random') {
    const randomKey = positionKeys[Math.floor(Math.random() * positionKeys.length)];
    return positions[randomKey];
  } else if (positions[mode]) {
    return positions[mode];
  } else {
    console.error(`❌ Invalid position: ${mode}. Valid options: tl, tr, bl, br, random`);
    process.exit(1);
  }
}

files.forEach(file => {
  const inputPath = path.join(INPUT_DIR, file);
  const outputPath = path.join(OUTPUT_DIR, `wm_${file}`);

  // Check file extension
  const isImage = file.match(/\.(jpg|jpeg|png)$/i);

  // Get position based on user preference
  const pos = getPosition(POSITION_MODE);

  const command = ffmpeg(inputPath)
    .input(WATERMARK)
    .complexFilter([{ filter: "overlay", options: pos }]);

  if (isImage) {
    // 🖼 If it's an image → output single frame
    command
      .frames(1)
      .save(outputPath);
  } else {
    // 🎬 If it's a video → output complete video (preserve audio)
    command
      .outputOptions("-c:a copy")
      .save(outputPath);
  }

  // Display start command
  command.on("start", commandLine => {
    console.log(`▶️ Starting to process ${isImage ? "image" : "video"}: ${file}`);
    console.log("FFmpeg command:", commandLine);
  });

  // Display progress (only videos have percent)
  command.on("progress", progress => {
    if (!isImage) {
      console.log(`Processing ${file}: ${progress.percent ? progress.percent.toFixed(2) : "?"}%`);
    }
  });

  // Display stderr verbose log
  command.on("stderr", line => {
    console.log(`[${file}] ffmpeg stderr:`, line);
  });

  // Completed
  command.on("end", () => {
    console.log(`✅ Output completed: ${outputPath}`);
  });

  // Error handling
  command.on("error", err => {
    console.error(`❌ Error occurred with ${file}:`, err.message);
  });
});