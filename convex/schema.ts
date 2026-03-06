import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  images: defineTable({
    storageId: v.id('_storage'),
    url: v.string(),
    breed: v.string(),
    createdAt: v.number(),
  }),
})
