import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import {
  generateEdges,
  generateBoxes,
  findCompletedBoxes,
  getNextPlayerId,
  isGameFinished,
} from "./helpers/gameLogic";
import { Player } from "./helpers/types";

/**
 * Create a hosted game (Player 1 waits for Player 2).
 */
export const createHostedGame = mutation({
  args: {
    gridSize: v.number(),
    hostName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const hostPlayerId = "player1";

    const players: Player[] = [
      {
        id: hostPlayerId,
        name: args.hostName?.trim() || "Player 1",
        score: 0,
      },
    ];

    const edges = generateEdges(args.gridSize);
    const boxes = generateBoxes(args.gridSize);

    const gameId = await ctx.db.insert("games", {
      status: "waiting",
      gridSize: args.gridSize,
      hostPlayerId,
      players,
      currentTurnPlayerId: hostPlayerId,
      edges,
      boxes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return gameId;
  },
});

/**
 * Join a hosted game using gameId.
 */
export const joinGame = mutation({
  args: {
    gameId: v.id("games"),
    playerName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("Game not found");

    if (game.status !== "waiting") {
      throw new Error("Game already started or finished");
    }

    if (game.players.length !== 1) {
      throw new Error("Game already has two players");
    }

    const newPlayer: Player = {
      id: "player2",
      name: args.playerName?.trim() || "Player 2",
      score: 0,
    };

    await ctx.db.patch(args.gameId, {
      players: [...game.players, newPlayer],
      status: "active",
      updatedAt: Date.now(),
    });

    return { success: true };
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
        ? playerId
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
