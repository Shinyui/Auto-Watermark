const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");

// ⚠️ If the system cannot find ffmpeg, manually specify the path:
// ffmpeg.setFfmpegPath("/opt/homebrew/bin/ffmpeg");

const INPUT_DIR = "";
const OUTPUT_DIR = "";
const WATERMARK = "";

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Filter supported files (videos + images)
const files = fs.readdirSync(INPUT_DIR).filter(f =>
  f.match(/\.(mp4|mov|avi|mkv|jpg|jpeg|png)$/i)
);

// Define coordinates for four corners
const positions = [
  { x: "10", y: "10" },  // Top-left
  { x: "main_w-overlay_w-10", y: "10" }, // Top-right
  { x: "10", y: "main_h-overlay_h-10" }, // Bottom-left
  { x: "main_w-overlay_w-10", y: "main_h-overlay_h-10" } // Bottom-right
];

files.forEach(file => {
  const inputPath = path.join(INPUT_DIR, file);
  const outputPath = path.join(OUTPUT_DIR, `wm_${file}`);

  // Check file extension
  const isImage = file.match(/\.(jpg|jpeg|png)$/i);

  // Randomly pick a position
  const pos = positions[Math.floor(Math.random() * positions.length)];

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