'use client'

import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'
import { Loader2, Copy, Images, Home, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

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
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  // Filter by breed search
  const filtered: ImgItem[] = images
    ? (images as ImgItem[]).filter(
        (img) =>
          search.trim() === '' || (img.breed ?? '').toLowerCase().includes(search.toLowerCase())
      )
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

          <div className="flex items-center gap-3 flex-1 max-w-md">
            <input
              type="search"
              placeholder="Search by breed…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1) // reset to first page on new search
              }}
              className="w-full rounded-full border bg-zinc-100 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400 dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
            />
          </div>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors shrink-0"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 py-8">
        {/* Title & stats */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <Images className="h-6 w-6 text-amber-500" />
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              All Generated Images
            </h1>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {images ? (
              <>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {images.length}
                </span>{' '}
                total unique images
                {search.trim() !== '' && (
                  <>
                    {' '}
                    —{' '}
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {filtered.length}
                    </span>{' '}
                    matching &quot;{search}&quot;
                  </>
                )}
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

        {/* No search results */}
        {images && images.length > 0 && filtered.length === 0 && (
          <div className="text-center py-20 text-zinc-500">
            No images match &quot;{search}&quot;.
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
      </main>

      <footer className="border-t mt-8 py-8 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4 text-center text-sm text-zinc-500">
          <p>Made with ❤️ for paw-some code reviews.</p>
        </div>
      </footer>
    </div>
  )
}
