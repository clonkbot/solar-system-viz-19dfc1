import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("celestialBodies").collect();
  },
});

export const get = query({
  args: { id: v.id("celestialBodies") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("celestialBodies").first();
    if (existing) return "Already seeded";

    const bodies = [
      {
        name: "Sun",
        type: "star" as const,
        distanceFromSun: 0,
        orbitalPeriod: 0,
        diameter: 1392700,
        color: "#FDB813",
        description: "The star at the center of our Solar System. A nearly perfect sphere of hot plasma, it provides the energy that sustains life on Earth.",
      },
      {
        name: "Mercury",
        type: "planet" as const,
        distanceFromSun: 0.39,
        orbitalPeriod: 88,
        diameter: 4879,
        color: "#B5B5B5",
        description: "The smallest planet and closest to the Sun. Despite its proximity to the Sun, it's not the hottest planet due to lack of atmosphere.",
        moons: 0,
      },
      {
        name: "Venus",
        type: "planet" as const,
        distanceFromSun: 0.72,
        orbitalPeriod: 225,
        diameter: 12104,
        color: "#E6C87A",
        description: "Often called Earth's twin due to similar size. Its thick atmosphere traps heat, making it the hottest planet in our solar system.",
        moons: 0,
      },
      {
        name: "Earth",
        type: "planet" as const,
        distanceFromSun: 1,
        orbitalPeriod: 365,
        diameter: 12742,
        color: "#6B93D6",
        description: "Our home planet. The only known world with liquid water on its surface and the only place we know of inhabited by living things.",
        moons: 1,
      },
      {
        name: "Mars",
        type: "planet" as const,
        distanceFromSun: 1.52,
        orbitalPeriod: 687,
        diameter: 6779,
        color: "#C1440E",
        description: "The Red Planet. Its rusty color comes from iron oxide on its surface. Home to the largest volcano and canyon in the solar system.",
        moons: 2,
      },
      {
        name: "Jupiter",
        type: "planet" as const,
        distanceFromSun: 5.2,
        orbitalPeriod: 4333,
        diameter: 139820,
        color: "#D8CA9D",
        description: "The largest planet in our solar system. Its Great Red Spot is a storm that has been raging for hundreds of years.",
        moons: 95,
        rings: true,
      },
      {
        name: "Saturn",
        type: "planet" as const,
        distanceFromSun: 9.54,
        orbitalPeriod: 10759,
        diameter: 116460,
        color: "#F4D59E",
        description: "Famous for its stunning ring system made of ice and rock. It's the least dense planet - it would float in water!",
        moons: 146,
        rings: true,
      },
      {
        name: "Uranus",
        type: "planet" as const,
        distanceFromSun: 19.2,
        orbitalPeriod: 30687,
        diameter: 50724,
        color: "#D1E7E7",
        description: "An ice giant that rotates on its side. Its unique tilt causes extreme seasons lasting over 20 years each.",
        moons: 28,
        rings: true,
      },
      {
        name: "Neptune",
        type: "planet" as const,
        distanceFromSun: 30.06,
        orbitalPeriod: 60190,
        diameter: 49244,
        color: "#5B5DDF",
        description: "The windiest planet with storms reaching 2,100 km/h. It's so far from the Sun that it takes 165 Earth years to orbit once.",
        moons: 16,
        rings: true,
      },
    ];

    for (const body of bodies) {
      await ctx.db.insert("celestialBodies", body);
    }

    return "Seeded successfully";
  },
});
