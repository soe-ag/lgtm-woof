'use server'

import fs from 'fs'
import path from 'path'
import { Resvg } from '@resvg/resvg-js'
import sharp from 'sharp'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

// ─── Font pool (name = internal family name verified to match Resvg) ─────────
const FONT_FILES = [
  { name: 'Amatic SC', file: 'AmaticSC.ttf' },
  { name: 'Bangers', file: 'Bangers.ttf' },
  { name: 'Bungee', file: 'Bungee.ttf' },
  { name: 'Handlee', file: 'Handlee.ttf' },
  { name: 'Pacifico', file: 'Pacifico.ttf' },
  { name: 'Patrick Hand', file: 'PatrickHand.ttf' },
  { name: 'Press Start 2P', file: 'PressStart2P.ttf' },
  { name: 'Righteous', file: 'Righteous.ttf' },
  { name: 'Rubik Mono One', file: 'RubikMonoOne.ttf' },
]

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Three buckets: flat | tilt-left (-5…-30°) | tilt-right (+5…+30°)
function randomAngle(): number {
  const bucket = Math.floor(Math.random() * 3)
  if (bucket === 0) return 0
  if (bucket === 1) return -(5 + Math.random() * 25)
  return 5 + Math.random() * 25
}

// ─── SVG builder ─────────────────────────────────────────────────────────────
function buildOverlaySvg(
  fontName: string,
  imgWidth: number,
  imgHeight: number,
  fontSize: number
): string {
  const cx = imgWidth * (0.2 + Math.random() * 0.6)
  const cy = imgHeight * (0.2 + Math.random() * 0.6)
  const angle = randomAngle()
  const strokeWidth = Math.max(4, Math.round(fontSize * 0.07))

  const colors = [
    { fill: 'white', stroke: '#000000' },
    { fill: '#FFE033', stroke: '#000000' },
    { fill: '#FF4D4D', stroke: '#000000' },
    { fill: '#4DFFB4', stroke: '#003322' },
  ]
  const { fill, stroke } = pickRandom(colors)

  // NOTE: font-family here must match the font name that Resvg sees in its fontBuffers
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${imgWidth}" height="${imgHeight}">
  <text
    x="${cx.toFixed(1)}"
    y="${cy.toFixed(1)}"
    font-family="${fontName}"
    font-size="${fontSize}"
    fill="${fill}"
    stroke="${stroke}"
    stroke-width="${strokeWidth}"
    paint-order="stroke"
    text-anchor="middle"
    dominant-baseline="middle"
    transform="rotate(${angle.toFixed(1)}, ${cx.toFixed(1)}, ${cy.toFixed(1)})"
  >LGTM</text>
</svg>`
}

// ─── Main export ──────────────────────────────────────────────────────────────
export async function generateLgtmImages() {
  try {
    // 1. Fetch 9 random dog images
    const res = await fetch('https://dog.ceo/api/breeds/image/random/9', { cache: 'no-store' })
    const data = await res.json()
    const imageUrls: string[] = data.message

    // 2. Load all fonts as raw Buffers (Resvg reads fonts via its own fontBuffers option)
    const fontsDir = path.join(process.cwd(), 'public/fonts')
    const loadedFonts = FONT_FILES.filter((f) => fs.existsSync(path.join(fontsDir, f.file))).map(
      (f) => ({
        name: f.name,
        filePath: path.join(fontsDir, f.file),
      })
    )

    if (loadedFonts.length === 0) throw new Error('No fonts found in public/fonts')

    // Shuffle the pool so every batch spreads a different font order
    const shuffledFonts = [...loadedFonts].sort(() => Math.random() - 0.5)

    const MAX_SIZE_RATIO = 0.22 // biggest:  imgWidth * 0.22
    const MIN_SIZE_RATIO = 0.11 // smallest: imgWidth * 0.11  (50% of max)

    const processedImages: { storageId: Id<'_storage'>; breed: string }[] = []

    // 3. Process each image
    for (const url of imageUrls) {
      const parts = url.split('/')
      const breedsIdx = parts.indexOf('breeds')
      const breed = breedsIdx !== -1 ? (parts[breedsIdx + 1] ?? 'unknown') : 'unknown'

      const imageBuffer = Buffer.from(await (await fetch(url)).arrayBuffer())
      const meta = await sharp(imageBuffer).metadata()
      const width = meta.width ?? 800
      const height = meta.height ?? 600

      // Cycle through the shuffled font pool — one unique font per image in the batch
      const font = shuffledFonts[processedImages.length % shuffledFonts.length]

      const maxFontSize = Math.round(width * MAX_SIZE_RATIO)
      const minFontSize = Math.round(width * MIN_SIZE_RATIO)
      const fontSize = minFontSize + Math.round(Math.random() * (maxFontSize - minFontSize))

      console.log(`[lgtm] #${processedImages.length + 1} font="${font.name}" size=${fontSize}px`)

      const svg = buildOverlaySvg(font.name, width, height, fontSize)

      // KEY FIX: use fontFiles (absolute paths) — Resvg ignores fontBuffers / @font-face CSS
      const resvg = new Resvg(svg, {
        fitTo: { mode: 'original' },
        font: {
          fontFiles: [font.filePath],
          loadSystemFonts: false, // only use our custom font, no system fallback
        },
      })

      const overlayPng = resvg.render().asPng()
      const finalBuffer = await sharp(imageBuffer)
        .composite([{ input: overlayPng }])
        .webp({ quality: 88 })
        .toBuffer()

      const uploadUrl = await convex.mutation(api.images.generateUploadUrl)
      const uploadRes = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'image/webp' },
        body: new Blob([new Uint8Array(finalBuffer)], { type: 'image/webp' }),
      })
      const { storageId } = await uploadRes.json()
      processedImages.push({ storageId: storageId as Id<'_storage'>, breed })
    }

    await convex.mutation(api.images.saveImages, { images: processedImages })
    return { success: true, count: processedImages.length }
  } catch (error: unknown) {
    const err = error as Error
    console.error('Error generating LGTM images:', err)
    return { success: false, error: err.message ?? 'Failed to generate images' }
  }
}
