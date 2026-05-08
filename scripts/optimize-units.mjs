import sharp from 'sharp'
import { readdir, stat } from 'node:fs/promises'
import { join, basename, extname } from 'node:path'

const SRC_DIR = 'public/images/units'
const TARGETS = ['unit-attico.jpg', 'unit-quadri-pt.jpg', 'unit-quadri-p2.jpg']

async function fileSizeKB(path) {
  const s = await stat(path)
  return Math.round(s.size / 1024)
}

async function optimize(file) {
  const inPath = join(SRC_DIR, file)
  const outPath = join(SRC_DIR, basename(file, extname(file)) + '.webp')
  const sizeBefore = await fileSizeKB(inPath)

  await sharp(inPath)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(outPath)

  const sizeAfter = await fileSizeKB(outPath)
  const reduction = Math.round((1 - sizeAfter / sizeBefore) * 100)
  console.log(`${file}: ${sizeBefore}KB → ${sizeAfter}KB (${reduction}% reduction) → ${outPath}`)
}

const all = await readdir(SRC_DIR)
console.log('Found in', SRC_DIR, ':', all)
console.log('---')

for (const t of TARGETS) {
  if (!all.includes(t)) {
    console.warn(`SKIP: ${t} not found in ${SRC_DIR}`)
    continue
  }
  await optimize(t)
}

console.log('---')
console.log('Done.')
