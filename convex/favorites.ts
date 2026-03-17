import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const bodies = await Promise.all(
      favorites.map(async (fav) => {
        const body = await ctx.db.get(fav.bodyId);
        return body ? { ...fav, body } : null;
      })
    );

    return bodies.filter(Boolean);
  },
});

export const toggle = mutation({
  args: { bodyId: v.id("celestialBodies") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("bodyId"), args.bodyId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { action: "removed" };
    } else {
      await ctx.db.insert("favorites", {
        userId,
        bodyId: args.bodyId,
        addedAt: Date.now(),
      });
      return { action: "added" };
    }
  },
});

export const isFavorite = query({
  args: { bodyId: v.id("celestialBodies") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("bodyId"), args.bodyId))
      .first();

    return !!existing;
  },
});
