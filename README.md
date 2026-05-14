# LGTM Woof 🐾

A web application for generating "LGTM" dog images to spice up your Pull Requests. Built with a focus on speed, aesthetics, and randomness.

## 🚀 Features

- **Batch Generation**: Generates 9 unique LGTM dog images in one click.
- **PIN Protected**: Secure image generation with a server-side PIN system — the secret never touches the client.
- **Rate Limited**: "Once-per-day" check prevents excessive storage usage; entering your PIN again overrides the limit.
- **Dynamic Overlays**: Uses `sharp` and `@resvg/resvg-js` to composite "LGTM" text onto each image with a random font, size, position, angle, and colour. Output is saved as WebP.
- **Custom Fonts**: Ships 8 hand-picked display fonts (Amatic SC, Bangers, Bungee, Handlee, Pacifico, Patrick Hand, Righteous, Rubik Mono One).
- **Interactive Gallery**: Browse every generated image at `/gallery`, filtered by dog breed, with paginated results (30 per page).
- **Quick Copy**: Click any image on the home page or in the gallery to instantly copy the GitHub Markdown to your clipboard.
- **Dark Mode**: Full light/dark theme support.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, React Compiler)
- **Database / Backend**: [Convex](https://www.convex.dev/)
- **Image Processing**: [Sharp](https://sharp.pixelplumbing.com/) & [@resvg/resvg-js](https://github.com/yisibl/resvg-js)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Dog Images**: [Dog CEO API](https://dog.ceo/dog-api/)

## ⚙️ Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Create a `.env.local` file with:
   ```bash
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   GENERATE_PIN= # Set your own 4-digit PIN
   ```

3. **Start the dev server** (runs Next.js and Convex in parallel):
   ```bash
   npm run dev
   ```
   > `predev` automatically runs `convex dev --until-success` before both servers start, so no separate Convex step is needed.

## 📖 License

This project is for personal use and learning. Dog images are provided via the Dog CEO API.
