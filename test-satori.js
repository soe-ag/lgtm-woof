const fs = require('fs')
const { Resvg } = require('@resvg/resvg-js')

const fonts = [
  'Bangers',
  'Bungee',
  'FredokaOne',
  'Handlee',
  'LuckiestGuy',
  'Pacifico',
  'PatrickHand',
  'Righteous',
  'RubikMonoOne',
]

const W = 400,
  H = 200,
  size = 80

for (const name of fonts) {
  const buf = fs.readFileSync(`public/fonts/${name}.ttf`)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="#2a4a6a"/>
    <text x="200" y="100" font-family="${name}" font-size="${size}"
      fill="white" stroke="black" stroke-width="5" paint-order="stroke"
      text-anchor="middle" dominant-baseline="middle">LGTM</text>
  </svg>`

  try {
    const resvg = new Resvg(svg, {
      fitTo: { mode: 'original' },
      font: { fontBuffers: [buf], loadSystemFonts: false },
    })
    const png = resvg.render().asPng()
    fs.writeFileSync(`test-${name}.png`, png)
    console.log(`OK: ${name} — ${png.length} bytes`)
  } catch (e) {
    console.log(`FAIL: ${name} — ${e.message}`)
  }
}
