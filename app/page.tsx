'use client'

import { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { generateLgtmImages } from './actions/generate'
import { toast } from 'sonner'
import { Loader2, Copy, Images } from 'lucide-react'
import Link from 'next/link'
import { Footer } from '@/components/Footer'

export default function Home() {
  const images = useQuery(api.images.getLatestBatch)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (isGenerating) return
    setIsGenerating(true)
    toast('Generating 9 LGTM Dogs! This may take a moment...', {
      icon: <Loader2 className="animate-spin" />,
    })

    try {
      const res = await generateLgtmImages()
      if (res.success) {
        toast.success(`Successfully generated 9 woofs!`)
      } else {
        toast.error(`Generation failed: ${res.error}`)
      }
    } catch {
      toast.error('An error occurred during generation.')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyMarkdown = (url: string) => {
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://lgtm-woof.example.com'
    const markdown = `[![LGTM](${url})](${origin})`
    navigator.clipboard.writeText(markdown)
    toast.success('Markdown copied to clipboard!', {
      description: markdown,
    })
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black bg-gradient-to-r from-[#7CBDE2] to-[#5AA7D1] bg-clip-text text-transparent">
              LGTM Woof 🐾
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/gallery"
              className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              <Images className="h-4 w-4" />
              Gallery
            </Link>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : '✨ Generate Random'}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-zinc-900 dark:text-white mb-4">
            Spice up your PRs with <span className="text-[#7CBDE2]">paw-some LGTMs</span>.
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Click on an image to copy the GitHub Markdown. Paste it into your pull requests, issues,
            or comments to spread the joy of good code.
          </p>
        </div>

        {!images ? (
          <div className="flex justify-center p-20">
            <Loader2 className="h-10 w-10 animate-spin text-zinc-400" />
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
            {images.map((img: { _id: string; url: string; breed?: string }) => (
              <div
                key={img._id}
                onClick={() => copyMarkdown(img.url)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 break-inside-avoid shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <img
                  src={img.url}
                  alt={img.breed || 'Dog'}
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="flex flex-col items-center text-white">
                    <Copy className="h-8 w-8 mb-2" />
                    <span className="font-semibold px-4 py-1.5 rounded-full bg-black/60 text-sm">
                      Copy Markdown
                    </span>
                  </div>
                </div>

                {/* Breed Tag */}
                {img.breed && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded-md">
                    <span className="text-xs font-medium text-white shadow-sm capitalize">
                      {img.breed.replace(/-/g, ' ')}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {images && images.length === 0 && (
          <div className="text-center py-20 text-zinc-500">
            No dogs found. Click &ldquo;Generate Random&rdquo; to get started!
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
