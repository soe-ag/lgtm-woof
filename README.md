# LGTM Woof 🐾

A web application for generating "LGTM" dog images to spice up your Pull Requests. Built with a focus on speed, aesthetics, and randomness.

## 🚀 Features

- **Batch Generation**: Generates 9 unique LGTM dog images in one click.
- **PIN Protected**: Secure image generation with a server-side PIN system.
- **Rate Limited**: Integrated "once-per-day" check to prevent excessive image storage.
- **Dynamic Overlays**: Uses `sharp` and `resvg` to overlay "LGTM" text with random fonts, sizes, and orientations.
- **Interactive Gallery**: Browse historical images filtered by dog breed.
- **Quick Copy**: Click any image to instantly copy the GitHub Markdown to your clipboard.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Database / Backend**: [Convex](https://www.convex.dev/)
- **Image Processing**: [Sharp](https://sharp.pixelplumbing.com/) & [Resvg](https://github.com/yisibl/resvg-js)
- **Styling**: Tailwind CSS (Project Theme: Soft Blue)
- **Source**: [Dog CEO API](https://dog.ceo/dog-api/)

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

3. **Run Convex**:
   ```bash
   npx convex dev
   ```

4. **Launch Dev Server**:
   ```bash
   npm run dev
   ```

## 📖 License

This project is for personal use and learning. Dog images are provided via the Dog CEO API.
