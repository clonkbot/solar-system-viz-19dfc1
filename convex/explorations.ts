import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const explorations = await ctx.db
      .query("explorations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    const withBodies = await Promise.all(
      explorations.map(async (exp) => {
        const body = await ctx.db.get(exp.bodyId);
        return body ? { ...exp, body } : null;
      })
    );

    return withBodies.filter(Boolean);
  },
});

export const visit = mutation({
  args: {
    bodyId: v.id("celestialBodies"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("explorations", {
      userId,
      bodyId: args.bodyId,
      visitedAt: Date.now(),
      notes: args.notes,
    });
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { totalVisits: 0, uniquePlanets: 0 };

    const explorations = await ctx.db
      .query("explorations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const uniqueBodies = new Set(explorations.map((e) => e.bodyId));

    return {
      totalVisits: explorations.length,
      uniquePlanets: uniqueBodies.size,
    };
  },
});
