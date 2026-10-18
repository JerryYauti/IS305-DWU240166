const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Adjust these values as needed
const STUDENT_ID = '240166';
const PROJECT_FOLDER = path.join(__dirname, '..'); // AT3_CampusServiceRequestSystem
const OUTPUT_ZIP = path.join(PROJECT_FOLDER, `${STUDENT_ID}_AT3_CampusServiceSystem.zip`);

async function createZip() {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(OUTPUT_ZIP);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`ZIP created: ${OUTPUT_ZIP} (${archive.pointer()} total bytes)`);
      resolve(OUTPUT_ZIP);
    });

    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') console.warn('Archive warning', err);
      else reject(err);
    });

    archive.on('error', (err) => reject(err));

    archive.pipe(output);

    // Include everything in project folder except node_modules and .git
    archive.glob('**/*', {
      cwd: PROJECT_FOLDER,
      dot: true,
      ignore: ['node_modules/**', '.git/**', `${path.basename(OUTPUT_ZIP)}`]
    });

    archive.finalize();
  });
}

(async () => {
  try {
    console.log('Creating Moodle ZIP...');
    await createZip();
    console.log('Done. Check the ZIP file in the project folder.');
  } catch (err) {
    console.error('Failed to create ZIP:', err);
    process.exit(1);
  }
})();
