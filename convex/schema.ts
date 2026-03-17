import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // Store celestial bodies with their properties
  celestialBodies: defineTable({
    name: v.string(),
    type: v.union(v.literal("star"), v.literal("planet"), v.literal("dwarf_planet"), v.literal("moon")),
    distanceFromSun: v.number(), // in AU (Astronomical Units)
    orbitalPeriod: v.number(), // in Earth days
    diameter: v.number(), // in km
    color: v.string(),
    description: v.string(),
    rings: v.optional(v.boolean()),
    moons: v.optional(v.number()),
  }),

  // User's favorite planets
  favorites: defineTable({
    userId: v.id("users"),
    bodyId: v.id("celestialBodies"),
    addedAt: v.number(),
  }).index("by_user", ["userId"]),

  // User exploration log - tracks which planets they've "visited"
  explorations: defineTable({
    userId: v.id("users"),
    bodyId: v.id("celestialBodies"),
    visitedAt: v.number(),
    notes: v.optional(v.string()),
  }).index("by_user", ["userId"]),
});
