// Regenerate PNG assets and a multi-resolution ICO from the SVG source.
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const source = await readFile(new URL('../public/icon.svg', import.meta.url));
for (const [name, size] of [['icon.png', 192], ['apple-icon.png', 180]]) {
  await sharp(source).resize(size, size).png().toFile(new URL(`../public/${name}`, import.meta.url).pathname);
}

// ICO supports embedded PNG frames; keep each size sharp at native resolution.
const sizes = [16, 32, 48, 256];
const frames = await Promise.all(sizes.map((size) => sharp(source).resize(size, size).png().toBuffer()));
const directory = Buffer.alloc(6 + sizes.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(sizes.length, 4);
let offset = directory.length;
frames.forEach((frame, i) => {
  const entry = 6 + i * 16;
  directory[entry] = directory[entry + 1] = sizes[i] === 256 ? 0 : sizes[i];
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(frame.length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += frame.length;
});
await writeFile(new URL('../public/favicon.ico', import.meta.url), Buffer.concat([directory, ...frames]));
console.log('Generated favicon.ico (16/32/48/256px), icon.png (192px), apple-icon.png (180px)');
