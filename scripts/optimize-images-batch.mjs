import sharp from 'sharp'
import { readdir, stat } from 'node:fs/promises'
import { join, basename, extname } from 'node:path'

const DIRS = ['public/images/bento', 'public/images/gallery']

async function fileSizeKB(path) {
  const s = await stat(path)
  return Math.round(s.size / 1024)
}

async function optimizeDir(dir) {
  const files = (await readdir(dir)).filter((f) => /\.(jpg|jpeg)$/i.test(f))
  let totalBefore = 0
  let totalAfter = 0
  console.log(`\n→ ${dir} (${files.length} files)`)
  for (const f of files) {
    const inPath = join(dir, f)
    const outPath = join(dir, basename(f, extname(f)) + '.webp')
    const sb = await fileSizeKB(inPath)
    await sharp(inPath)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outPath)
    const sa = await fileSizeKB(outPath)
    totalBefore += sb
    totalAfter += sa
    console.log(`  ${f}: ${sb}KB → ${sa}KB`)
  }
  if (totalBefore > 0) {
    const pct = Math.round((1 - totalAfter / totalBefore) * 100)
    console.log(`  TOTAL: ${totalBefore}KB → ${totalAfter}KB (${pct}% reduction)`)
  }
}

for (const d of DIRS) await optimizeDir(d)
console.log('\nDone.')
