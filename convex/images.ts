import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const getImages = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const images = await ctx.db
      .query('images')
      .order('desc')
      .take(args.limit ?? 100)
    return images
  },
})

export const getAllImages = query({
  args: {},
  handler: async (ctx) => {
    const images = await ctx.db.query('images').order('desc').collect()
    // Deduplicate by storageId — keep only the first occurrence (most recent)
    const seen = new Set<string>()
    return images.filter((img) => {
      const key = img.storageId as string
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  },
})

// Returns only the images from the most recently generated batch
export const getLatestBatch = query({
  args: {},
  handler: async (ctx) => {
    const images = await ctx.db.query('images').order('desc').take(9)
    if (images.length === 0) return []
    // All images in the same batch share the same createdAt timestamp
    const latestTime = images[0].createdAt
    return images.filter((img) => img.createdAt === latestTime)
  },
})

export const saveImages = mutation({
  args: {
    images: v.array(
      v.object({
        storageId: v.id('_storage'),
        breed: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    for (const image of args.images) {
      const publicUrl = await ctx.storage.getUrl(image.storageId)
      if (!publicUrl) throw new Error('Could not get public URL for image')

      await ctx.db.insert('images', {
        storageId: image.storageId,
        url: publicUrl,
        breed: image.breed,
        createdAt: now,
      })
    }
  },
})

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl()
  },
})

// Returns the timestamp of the most recent generation (null if never generated)
export const getLastGeneratedAt = query({
  args: {},
  handler: async (ctx) => {
    const logs = await ctx.db.query('generationLog').order('desc').take(1)
    return logs[0]?.generatedAt ?? null
  },
})

// Records that a generation happened right now
export const recordGeneration = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now()
    const dateKey = new Date(now).toISOString().slice(0, 10) // "YYYY-MM-DD"
    await ctx.db.insert('generationLog', { generatedAt: now, dateKey })
  },
})
