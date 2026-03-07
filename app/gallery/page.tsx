'use client'

import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'
import { Loader2, Copy, Images, Home, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Footer } from '@/components/Footer'

type ImgItem = {
  _id: string
  url: string
  breed?: string
  createdAt: number
}

const PAGE_SIZE = 30

function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number
  totalPages: number
  onPage: (p: number) => void
}) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Prev
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPage(p)}
          className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
            p === page
              ? 'bg-amber-500 text-white shadow'
              : 'border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

export default function GalleryPage() {
  const images = useQuery(api.images.getAllImages)
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const uniqueBreeds = images
    ? Array.from(
        new Set((images as ImgItem[]).map((img) => img.breed).filter(Boolean) as string[])
      ).sort()
    : []

  // Filter by breed selection
  const filtered: ImgItem[] = images
    ? (images as ImgItem[]).filter((img) => selectedBreed === null || img.breed === selectedBreed)
    : []

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  // Clamp page if filter changes reduce total pages
  const safePage = Math.min(page, totalPages)
  const pageStart = (safePage - 1) * PAGE_SIZE
  const paginated = filtered.slice(pageStart, pageStart + PAGE_SIZE)

  const handlePage = (p: number) => {
    setPage(Math.max(1, Math.min(p, totalPages)))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const copyMarkdown = (img: ImgItem) => {
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://lgtm-woof.example.com'
    const markdown = `[![LGTM](${img.url})](${origin})`
    navigator.clipboard.writeText(markdown)
    setCopied(img._id)
    setTimeout(() => setCopied(null), 1800)
    toast.success('Markdown copied!', { description: markdown })
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-black bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent shrink-0"
          >
            LGTM Woof 🐾
          </Link>

          <div className="flex-1"></div>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors shrink-0"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 p-4 shadow-sm max-h-[calc(100vh-8rem)] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white flex items-center gap-2">
              <Images className="h-5 w-5 text-amber-500" />
              Breeds
            </h2>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => {
                    setSelectedBreed(null)
                    setPage(1)
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedBreed === null
                      ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200 shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span>All Breeds</span>
                  <span className="text-xs bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-full">
                    {images?.length || 0}
                  </span>
                </button>
              </li>
              {uniqueBreeds.map((breed) => {
                const count =
                  (images as ImgItem[])?.filter((img) => img.breed === breed).length || 0
                return (
                  <li key={breed}>
                    <button
                      onClick={() => {
                        setSelectedBreed(breed)
                        setPage(1)
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                        selectedBreed === breed
                          ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200 shadow-sm'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <span>{breed.replace(/-/g, ' ')}</span>
                      <span className="text-xs bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-full">
                        {count}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </aside>

        {/* Gallery Content */}
        <div className="flex-1 min-w-0">
          {/* Title & stats */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white capitalize">
                {selectedBreed
                  ? `${selectedBreed.replace(/-/g, ' ')} Images`
                  : 'All Generated Images'}
              </h1>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {images ? (
                <>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {filtered.length}
                  </span>{' '}
                  {selectedBreed ? 'images' : 'total unique images'}
                  {totalPages > 1 && (
                    <>
                      {' '}
                      &mdash; page{' '}
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        {safePage}
                      </span>{' '}
                      of{' '}
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        {totalPages}
                      </span>
                    </>
                  )}
                </>
              ) : (
                'Loading…'
              )}
            </p>
          </div>

          {/* Loading */}
          {!images && (
            <div className="flex justify-center py-24">
              <Loader2 className="h-10 w-10 animate-spin text-zinc-400" />
            </div>
          )}

          {/* Empty state */}
          {images && images.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-zinc-400">
              <span className="text-6xl">🐾</span>
              <p className="text-lg font-medium">No images yet.</p>
              <Link href="/" className="text-amber-500 underline text-sm">
                Go generate some!
              </Link>
            </div>
          )}

          {/* No images for selected breed */}
          {images && images.length > 0 && filtered.length === 0 && (
            <div className="text-center py-20 text-zinc-500">
              No images match the selected breed.
            </div>
          )}

          {/* TOP pagination */}
          {filtered.length > 0 && (
            <Pagination page={safePage} totalPages={totalPages} onPage={handlePage} />
          )}

          {/* Grid */}
          {paginated.length > 0 && (
            <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4 mt-2">
              {paginated.map((img) => {
                const isCopied = copied === img._id
                return (
                  <div
                    key={img._id}
                    onClick={() => copyMarkdown(img)}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 break-inside-avoid shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <img
                      src={img.url}
                      alt={img.breed ?? 'Dog'}
                      className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Copy overlay */}
                    <div
                      className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 backdrop-blur-[2px] ${
                        isCopied
                          ? 'bg-green-600/60 opacity-100'
                          : 'bg-black/40 opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {isCopied ? (
                        <span className="text-white font-bold text-lg">✓ Copied!</span>
                      ) : (
                        <>
                          <Copy className="h-7 w-7 text-white mb-1.5" />
                          <span className="text-white text-xs font-semibold px-3 py-1 rounded-full bg-black/60">
                            Copy Markdown
                          </span>
                        </>
                      )}
                    </div>

                    {/* Breed tag */}
                    {img.breed && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/55 backdrop-blur-md rounded-md">
                        <span className="text-xs font-medium text-white capitalize">
                          {img.breed.replace(/-/g, ' ')}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* BOTTOM pagination */}
          {filtered.length > 0 && (
            <Pagination page={safePage} totalPages={totalPages} onPage={handlePage} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
