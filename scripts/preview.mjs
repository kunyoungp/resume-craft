// Usage: node preview.mjs <file.html>
import { exec } from 'child_process';
import { platform } from 'os';
import { resolve } from 'path';

const filePath = resolve(process.argv[2]);
const cmd = platform() === 'darwin' ? 'open' : platform() === 'win32' ? 'start' : 'xdg-open';
exec(`${cmd} "${filePath}"`);
