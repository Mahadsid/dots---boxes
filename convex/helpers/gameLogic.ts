import { Edge, Box, Player } from "./types";

/**
 * Generate all edges for a grid of given size.
 * gridSize = number of dots per row/column.
 */
export function generateEdges(gridSize: number): Edge[] {
  const edges: Edge[] = [];
  const id = (a: number, b: number, c: number, d: number) => `${a},${b}-${c},${d}`;

  // Horizontal edges
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize - 1; x++) {
      edges.push({
        id: id(x, y, x + 1, y),
        from: { x, y },
        to: { x: x + 1, y },
        claimedBy: null,
      });
    }
  }

  // Vertical edges
  for (let y = 0; y < gridSize - 1; y++) {
    for (let x = 0; x < gridSize; x++) {
      edges.push({
        id: id(x, y, x, y + 1),
        from: { x, y },
        to: { x, y: y + 1 },
        claimedBy: null,
      });
    }
  }

  return edges;
}

/**
 * Generate all boxes for a grid.
 */
export function generateBoxes(gridSize: number): Box[] {
  const boxes: Box[] = [];
  const edgeId = (a: number, b: number, c: number, d: number) => `${a},${b}-${c},${d}`;

  for (let y = 0; y < gridSize - 1; y++) {
    for (let x = 0; x < gridSize - 1; x++) {
      boxes.push({
        id: `box-${x}-${y}`,
        topEdgeId: edgeId(x, y, x + 1, y),
        rightEdgeId: edgeId(x + 1, y, x + 1, y + 1),
        bottomEdgeId: edgeId(x, y + 1, x + 1, y + 1),
        leftEdgeId: edgeId(x, y, x, y + 1),
        ownerId: null,
      });
    }
  }

  return boxes;
}

/**
 * Check which boxes are completed after a move.
 */
export function findCompletedBoxes(
  boxes: Box[],
  edges: Edge[],
  claimingPlayerId: string
): { updatedBoxes: Box[]; completedCount: number } {
  const edgeMap = new Map(edges.map((e) => [e.id, e]));
  let completedCount = 0;

  const updatedBoxes = boxes.map((box) => {
    if (box.ownerId) return box;

    const top = edgeMap.get(box.topEdgeId);
    const right = edgeMap.get(box.rightEdgeId);
    const bottom = edgeMap.get(box.bottomEdgeId);
    const left = edgeMap.get(box.leftEdgeId);

    const allClaimed =
      top?.claimedBy &&
      right?.claimedBy &&
      bottom?.claimedBy &&
      left?.claimedBy;

    if (allClaimed) {
      completedCount++;
      return { ...box, ownerId: claimingPlayerId };
    }

    return box;
  });

  return { updatedBoxes, completedCount };
}

/**
 * Get next player's turn.
 */
export function getNextPlayerId(players: Player[], currentPlayerId: string): string {
  const index = players.findIndex((p) => p.id === currentPlayerId);
  if (index === -1) throw new Error("Current player not found");

  const nextIndex = (index + 1) % players.length;
  return players[nextIndex].id;
}

/**
 * Check if the game is finished.
 */
export function isGameFinished(boxes: Box[]): boolean {
  return boxes.every((box) => box.ownerId !== null);
}
