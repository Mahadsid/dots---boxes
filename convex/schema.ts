import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  games: defineTable({
    status: v.union(v.literal("waiting"), v.literal("active"), v.literal("finished")),
    gridSize: v.number(), // e.g., 4 means 4x4 dots = 3x3 boxes
    players: v.array(
      v.object({
        id: v.string(), // userId or "AI"
        name: v.string(),
        score: v.number(),
      })
    ),
    currentTurnPlayerId: v.string(),

    // All edges in the grid
    edges: v.array(
      v.object({
        id: v.string(), // unique edge ID
        from: v.object({ x: v.number(), y: v.number() }),
        to: v.object({ x: v.number(), y: v.number() }),
        claimedBy: v.union(v.string(), v.null()),
      })
    ),

    // All boxes in the grid
    boxes: v.array(
      v.object({
        id: v.string(),
        topEdgeId: v.string(),
        rightEdgeId: v.string(),
        bottomEdgeId: v.string(),
        leftEdgeId: v.string(),
        ownerId: v.union(v.string(), v.null()),
      })
    ),

    createdAt: v.number(),
    updatedAt: v.number(),
  }),
});
