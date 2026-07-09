import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outDir = path.join(root, "public", "images");
const sourceRoot = path.join(root, "assets", "source-images");
const folders = {
  painting: "Painting",
  decks: "Decks",
  remodeling: "Remodeling Services",
  roofing: "Roofing",
  siding: "Siding",
  windows: "Windows Installation"
};

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

await fs.mkdir(outDir, { recursive: true });

for (const [category, folder] of Object.entries(folders)) {
  const inputDir = path.join(sourceRoot, folder);
  let files = [];
  try {
    files = await fs.readdir(inputDir);
  } catch {
    continue;
  }

  for (const file of files) {
    if (!/\.(png|jpe?g|webp)$/i.test(file)) continue;
    const source = path.join(inputDir, file);
    const base = `${category}-${slugify(path.parse(file).name)}.webp`;
    const target = path.join(outDir, base);

    try {
      await fs.access(target);
      continue;
    } catch {
      // Create the asset below.
    }

    const image = sharp(source, { failOn: "none" }).rotate();
    const meta = await image.metadata();
    const width = Math.min(meta.width || 1400, 1400);
    await image
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 78, effort: 5 })
      .toFile(target);
  }
}
