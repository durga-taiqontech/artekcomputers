// One-time helper: converts the JPG/PNG images in the folders below to WebP
// (max 1600px wide, quality 80). Originals are kept so you can compare, then
// delete them once the site looks right.
//
// Run from the project root:  node scripts/convert-images.mjs
import sharp from 'sharp'
import { readdir, stat } from 'node:fs/promises'
import path from 'node:path'

const folders = [
  'src/assets/products',
  'src/assets/company',
  'src/assets/solutions',
  'public/images/steps',
]
const MAX_WIDTH = 1600

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`
let totalBefore = 0
let totalAfter = 0

for (const folder of folders) {
  let files
  try {
    files = await readdir(folder)
  } catch {
    console.log(`skip (not found): ${folder}`)
    continue
  }

  for (const file of files) {
    if (!/\.(jpe?g|png)$/i.test(file)) continue

    const input = path.join(folder, file)
    const output = path.join(folder, file.replace(/\.(jpe?g|png)$/i, '.webp'))

    await sharp(input)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(output)

    const before = (await stat(input)).size
    const after = (await stat(output)).size
    totalBefore += before
    totalAfter += after
    console.log(`${input}: ${kb(before)} -> ${kb(after)}`)
  }
}

console.log(`\nTotal: ${kb(totalBefore)} -> ${kb(totalAfter)}`)
