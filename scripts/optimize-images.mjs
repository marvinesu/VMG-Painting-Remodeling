/**
 * Image optimizer for public/images.
 *
 * For every base .webp image:
 *  - re-encodes the original capped at 1440px wide (quality 72)
 *  - generates 480w and 960w variants used in srcset (suffixed -480 / -960)
 *
 * Run after adding new images:  node scripts/optimize-images.mjs
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const IMAGE_DIR = fileURLToPath(new URL("../public/images/", import.meta.url));
const MAX_WIDTH = 1440;
const VARIANTS = [480, 960];
const QUALITY = 72;

// OneDrive/antivirus can hold short-lived locks on freshly written files.
async function writeWithRetry(path, data, attempts = 5) {
  for (let i = 0; i < attempts; i++) {
    try {
      await writeFile(path, data);
      return;
    } catch (error) {
      if (i === attempts - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 300 * (i + 1)));
    }
  }
}

const files = (await readdir(IMAGE_DIR)).filter(
  (name) => name.endsWith(".webp") && !/-(480|960)\.webp$/.test(name)
);

let before = 0;
let after = 0;

for (const name of files) {
  const path = join(IMAGE_DIR, name);
  const source = await readFile(path);
  before += source.length;

  const meta = await sharp(source).metadata();
  const reencoded = await sharp(source)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 5 })
    .toBuffer();

  const finalBuffer = reencoded.length < source.length ? reencoded : source;
  if (reencoded.length < source.length) {
    await writeWithRetry(path, reencoded);
  }
  after += finalBuffer.length;

  // Responsive variants (always written so srcset URLs are guaranteed to exist).
  for (const width of VARIANTS) {
    const variant = await sharp(finalBuffer)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 5 })
      .toBuffer();
    await writeWithRetry(join(IMAGE_DIR, `${name.replace(/\.webp$/, "")}-${width}.webp`), variant);
  }

  console.log(`${name}: ${meta.width}x${meta.height} ${(source.length / 1024).toFixed(0)}KB -> ${(finalBuffer.length / 1024).toFixed(0)}KB`);
}

console.log(`\nBase images: ${files.length}`);
console.log(`Total before: ${(before / 1024 / 1024).toFixed(2)} MB`);
console.log(`Total after (originals only): ${(after / 1024 / 1024).toFixed(2)} MB`);
