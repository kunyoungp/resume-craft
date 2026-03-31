// Usage: node export-pdf.mjs <input.html> <output.pdf>
import { chromium } from 'playwright';
import { resolve } from 'path';

const [inputPath, outputPath] = process.argv.slice(2);
if (!inputPath || !outputPath) {
  console.error('Usage: node export-pdf.mjs <input.html> <output.pdf>');
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`file://${resolve(inputPath)}`, { waitUntil: 'networkidle' });
await page.pdf({
  path: resolve(outputPath),
  format: 'A4',
  printBackground: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' }
});
await browser.close();
console.log(`PDF exported to ${resolve(outputPath)}`);
