'use client'

import { useState, useRef, useEffect } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { generateLgtmImages } from './actions/generate'
import { toast } from 'sonner'
import { Loader2, Copy, Images, Lock, ShieldAlert, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

// ── Helpers ───────────────────────────────────────────────────────────────────
function todayUtcKey(): string {
  return new Date().toISOString().slice(0, 10) // "YYYY-MM-DD"
}

function isGeneratedToday(lastGeneratedAt: number | null): boolean {
  if (!lastGeneratedAt) return false
  const lastKey = new Date(lastGeneratedAt).toISOString().slice(0, 10)
  return lastKey === todayUtcKey()
}

// ── PIN Input (4 individual boxes) ───────────────────────────────────────────
function PinInput({
  value,
  onChange,
  error,
}: {
  value: string
  onChange: (v: string) => void
  error: boolean
}) {
  const LENGTH = 4
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) {
      refs.current[i - 1]?.focus()
      onChange(value.slice(0, i - 1))
    }
  }

  const handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1)
    const next = value.slice(0, i) + char + value.slice(i + 1)
    onChange(next.slice(0, LENGTH))
    if (char && i < LENGTH - 1) refs.current[i + 1]?.focus()
  }

  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length: LENGTH }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ''}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
          className={`w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all bg-white dark:bg-zinc-900
            ${
              error
                ? 'border-red-400 text-red-500 animate-[shake_0.3s_ease]'
                : value[i]
                  ? 'border-[#7CBDE2] text-zinc-900 dark:text-white shadow-md shadow-[#7CBDE2]/20'
                  : 'border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white'
            }
            focus:border-[#7CBDE2] focus:shadow-md focus:shadow-[#7CBDE2]/20
          `}
        />
      ))}
    </div>
  )
}

// ── Generate Modal ─────────────────────────────────────────────────────────────
function GenerateModal({
  open,
  onClose,
  alreadyToday,
  onSuccess,
}: {
  open: boolean
  onClose: () => void
  alreadyToday: boolean
  onSuccess: () => void
}) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) {
      setPin('')
      setError(false)
      setLoading(false)
    }
  }, [open])

  // Auto-submit when 4 digits filled
  useEffect(() => {
    if (pin.length === 4 && !loading) {
      handleSubmit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin])

  const handleSubmit = async () => {
    if (pin.length < 4 || loading) return
    setLoading(true)
    setError(false)

    toast('Generating 9 LGTM Dogs! This may take a moment...', {
      icon: <Loader2 className="animate-spin" />,
    })
    onClose()

    const res = await generateLgtmImages(pin)
    setLoading(false)

    if (res.success) {
      toast.success(`Successfully generated 9 woofs! 🐾`)
      onSuccess()
    } else {
      if (
        res.error?.toLowerCase().includes('pin') ||
        res.error?.toLowerCase().includes('incorrect')
      ) {
        setError(true)
        setPin('')
        toast.error('Wrong PIN', { description: 'Please try again.' })
        // Re-open modal so user can retry
      } else {
        toast.error(`Generation failed: ${res.error}`)
      }
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose()
      }}
    >
      <DialogContent className="max-w-sm w-full rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl p-8">
        <DialogHeader className="items-center text-center gap-2 mb-2">
          {alreadyToday ? (
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center mb-1">
              <ShieldAlert className="h-7 w-7 text-amber-500" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-950/40 flex items-center justify-center mb-1">
              <Lock className="h-7 w-7 text-[#7CBDE2]" />
            </div>
          )}
          <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-white">
            {alreadyToday ? 'Already generated today' : 'Enter PIN to generate'}
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {alreadyToday ? (
              <>
                Images can only be generated{' '}
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">once per day</span>{' '}
                to keep things fresh. Enter your PIN below to override and generate anyway.
              </>
            ) : (
              <>
                Enter your{' '}
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">4-digit PIN</span>{' '}
                to generate a new batch of LGTM dog images.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {alreadyToday && (
          <div className="flex items-start gap-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-4 py-3 mb-1">
            <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
              Generation has already happened today. If you still want to proceed, enter your PIN to
              unlock it.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-4 mt-2">
          <PinInput value={pin} onChange={setPin} error={error} />

          {error && (
            <p className="text-center text-xs text-red-500 font-medium">
              Incorrect PIN — please try again
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={pin.length < 4 || loading}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 dark:bg-white py-3 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate 9 Dogs
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function Home() {
  const images = useQuery(api.images.getLatestBatch)
  const lastGeneratedAt = useQuery(api.images.getLastGeneratedAt)
  const [modalOpen, setModalOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const alreadyToday = isGeneratedToday(lastGeneratedAt ?? null)

  const handleGenerateClick = () => {
    if (isGenerating) return
    setModalOpen(true)
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
              onClick={handleGenerateClick}
              disabled={isGenerating}
              className="flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer transition-colors"
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

      <GenerateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        alreadyToday={alreadyToday}
        onSuccess={() => setIsGenerating(false)}
      />
    </div>
  )
}
