// ELAIA — converte e ridimensiona tutte le immagini PNG/JPG in public/images/*
// in formato webp (qualità 80, max 1920px lato lungo). Rimuove originali grandi.
import sharp from 'sharp'
import { readdir, stat, unlink } from 'node:fs/promises'
import { join, basename, extname } from 'node:path'

const ROOT = 'public/images'
const SUBDIRS = ['hero', 'vista', 'bento', 'gallery', 'units', 'tod']
const MAX_WIDTH = 1920
const QUALITY = 80
// Hero deve restare alta qualità ma full-width
const HERO_MAX = 2400

async function sizeKB(p) {
  const s = await stat(p)
  return Math.round(s.size / 1024)
}

async function optimizeDir(dir) {
  let entries
  try {
    entries = await readdir(dir)
  } catch {
    console.log(`  (skip ${dir} — non esiste)`)
    return
  }
  const files = entries.filter((f) => /\.(png|jpe?g)$/i.test(f))
  if (!files.length) {
    console.log(`  (skip ${dir} — nessun PNG/JPG)`)
    return
  }
  console.log(`\n→ ${dir} (${files.length} files)`)
  let before = 0
  let after = 0
  const isHero = dir.endsWith('hero')
  for (const f of files) {
    const inPath = join(dir, f)
    const outPath = join(dir, basename(f, extname(f)) + '.webp')
    const sb = await sizeKB(inPath)
    await sharp(inPath)
      .resize({ width: isHero ? HERO_MAX : MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 5 })
      .toFile(outPath)
    const sa = await sizeKB(outPath)
    before += sb
    after += sa
    console.log(`  ${f}: ${sb}KB → ${sa}KB (.webp)`)
    // Rimuovi originale (sostituito dal webp)
    await unlink(inPath)
  }
  const pct = before ? Math.round((1 - after / before) * 100) : 0
  console.log(`  TOTAL: ${before}KB → ${after}KB (${pct}% riduzione)`)
}

console.log('ELAIA image optimizer')
for (const sub of SUBDIRS) {
  await optimizeDir(join(ROOT, sub))
}
console.log('\nFatto.')
