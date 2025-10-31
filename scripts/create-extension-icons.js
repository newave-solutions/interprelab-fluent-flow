const fs = require('fs');
const path = require('path');

// Simple PNG file structure (1x1 pixel, but we'll make it the right size)
// This creates a minimal valid PNG file
function createPNG(size, color = { r: 79, g: 70, b: 229 }) {
  const width = size;
  const height = size;

  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(25);
  ihdr.writeUInt32BE(13, 0); // Length
  ihdr.write('IHDR', 4);
  ihdr.writeUInt32BE(width, 8);
  ihdr.writeUInt32BE(height, 12);
  ihdr.writeUInt8(8, 16); // Bit depth
  ihdr.writeUInt8(2, 17); // Color type (RGB)
  ihdr.writeUInt8(0, 18); // Compression
  ihdr.writeUInt8(0, 19); // Filter
  ihdr.writeUInt8(0, 20); // Interlace

  // Calculate CRC for IHDR
  const crc = require('zlib').crc32(ihdr.slice(4, 21));
  ihdr.writeUInt32BE(crc, 21);

  // IDAT chunk - simple solid color
  const pixelData = Buffer.alloc(width * height * 3 + height);
  for (let y = 0; y < height; y++) {
    pixelData[y * (width * 3 + 1)] = 0; // Filter type
    for (let x = 0; x < width; x++) {
      const offset = y * (width * 3 + 1) + 1 + x * 3;
      pixelData[offset] = color.r;
      pixelData[offset + 1] = color.g;
      pixelData[offset + 2] = color.b;
    }
  }

  const compressed = require('zlib').deflateSync(pixelData);
  const idat = Buffer.alloc(compressed.length + 12);
  idat.writeUInt32BE(compressed.length, 0);
  idat.write('IDAT', 4);
  compressed.copy(idat, 8);
  const idatCrc = require('zlib').crc32(idat.slice(4, idat.length - 4));
  idat.writeUInt32BE(idatCrc, idat.length - 4);

  // IEND chunk
  const iend = Buffer.from([0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]);

  return Buffer.concat([signature, ihdr, idat, iend]);
}

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '..', 'public', 'chrome-extension');

// Create icons
const sizes = [16, 48, 128];
sizes.forEach(size => {
  const png = createPNG(size);
  fs.writeFileSync(path.join(iconsDir, `icon${size}.png`), png);
  console.log(`Created icon${size}.png`);
});

console.log('All icons created successfully!');
