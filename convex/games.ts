import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import {
  generateEdges,
  generateBoxes,
  findCompletedBoxes,
  getNextPlayerId,
  isGameFinished,
} from "./helpers/gameLogic";
import { Game, Player, Edge, Box } from "./helpers/types";

/**
 * Create a new game (Player vs Computer or Player vs Player placeholder).
 */
export const createGame = mutation({
  args: {
    gridSize: v.number(),
    playerName: v.string(),
    mode: v.union(v.literal("vsAI"), v.literal("localPvP")),
  },
  handler: async (ctx, args) => {
    const { gridSize, playerName, mode } = args;

    const players: Player[] =
      mode === "vsAI"
        ? [
            { id: "player1", name: playerName, score: 0 },
            { id: "AI", name: "Computer", score: 0 },
          ]
        : [
            { id: "player1", name: playerName, score: 0 },
            { id: "player2", name: "Player 2", score: 0 },
          ];

    const edges = generateEdges(gridSize);
    const boxes = generateBoxes(gridSize);

    const gameId = await ctx.db.insert("games", {
      status: "active",
      gridSize,
      players,
      currentTurnPlayerId: players[0].id,
      edges,
      boxes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return gameId;
  },
});

/**
 * Get a game by ID.
 */
export const getGame = query({
  args: {
    gameId: v.id("games"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.gameId);
  },
});

/**
 * Make a move (claim an edge).
 */
export const makeMove = mutation({
  args: {
    gameId: v.id("games"),
    playerId: v.string(),
    edgeId: v.string(),
  },
  handler: async (ctx, args) => {
    const { gameId, playerId, edgeId } = args;

    const game = await ctx.db.get(gameId);
    if (!game) throw new Error("Game not found");

    if (game.status !== "active") {
      throw new Error("Game is not active");
    }

    if (game.currentTurnPlayerId !== playerId) {
      throw new Error("Not your turn");
    }

    const edges = [...game.edges];
    const edgeIndex = edges.findIndex((e) => e.id === edgeId);
    if (edgeIndex === -1) throw new Error("Edge not found");

    if (edges[edgeIndex].claimedBy) {
      throw new Error("Edge already claimed");
    }

    // Claim the edge
    edges[edgeIndex] = {
      ...edges[edgeIndex],
      claimedBy: playerId,
    };

    // Check for completed boxes
    const { updatedBoxes, completedCount } = findCompletedBoxes(
      game.boxes,
      edges,
      playerId
    );

    // Update players' scores
    const players = game.players.map((player) =>
      player.id === playerId
        ? { ...player, score: player.score + completedCount }
        : player
    );

    // Determine next turn
    const nextTurnPlayerId =
      completedCount > 0
        ? playerId // player gets another turn if they completed a box
        : getNextPlayerId(players, playerId);

    // Check if game finished
    const finished = isGameFinished(updatedBoxes);

    await ctx.db.patch(gameId, {
      edges,
      boxes: updatedBoxes,
      players,
      currentTurnPlayerId: nextTurnPlayerId,
      status: finished ? "finished" : game.status,
      updatedAt: Date.now(),
    });

    return {
      success: true,
      completedBoxes: completedCount,
      nextTurnPlayerId,
      gameFinished: finished,
    };
  },
});
