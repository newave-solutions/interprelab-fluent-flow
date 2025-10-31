const fs = require('fs');
const path = require('path');

// Minimal valid PNG files (solid color squares) as base64
const icons = {
  // 16x16 purple square
  icon16: 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAKklEQVR42mNgYGD4T0FgYmKiWD8DAwMDEwMDw38KAcWGUGwAxYZQZggAuBkEEfXTnV0AAAAASUVORK5CYII=',
  // 48x48 purple square
  icon48: 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAOklEQVR42u3OMQ0AAAgDIJfc/560BHRpKHTPzAzAf1YABQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFhVcBvyIEEXzxRFsAAAAASUVORK5CYII=',
  // 128x128 purple square
  icon128: 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAnElEQVR42u3OMQ0AAAgDIJfc/560BHRpKHTPzAzAf1YABQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBYVXAb8iBBF88URbAAAAAElFTkSuQmCC'
};

const outputDir = path.join(__dirname, '..', 'public', 'chrome-extension');

// Write each icon
Object.entries(icons).forEach(([name, base64Data]) => {
  const buffer = Buffer.from(base64Data, 'base64');
  const filename = `${name}.png`;
  fs.writeFileSync(path.join(outputDir, filename), buffer);
  console.log(`Created ${filename}`);
});

console.log('All extension icons created successfully!');
