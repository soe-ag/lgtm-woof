import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  images: defineTable({
    storageId: v.id('_storage'),
    url: v.string(),
    breed: v.string(),
    createdAt: v.number(),
  }),
  generationLog: defineTable({
    generatedAt: v.number(), // Unix ms timestamp
    dateKey: v.string(), // "YYYY-MM-DD" in UTC, for fast daily lookup
  }).index('by_dateKey', ['dateKey']),
})
