export type Player = {
  id: string;
  name: string;
  score: number;
};

export type Dot = {
  x: number;
  y: number;
};

export type Edge = {
  id: string;
  from: Dot;
  to: Dot;
  claimedBy: string | null;
};

export type Box = {
  id: string;
  topEdgeId: string;
  rightEdgeId: string;
  bottomEdgeId: string;
  leftEdgeId: string;
  ownerId: string | null;
};

export type Game = {
  _id: string;
  status: "waiting" | "active" | "finished";
  gridSize: number;
  players: Player[];
  currentTurnPlayerId: string;
  edges: Edge[];
  boxes: Box[];
  createdAt: number;
  updatedAt: number;
};
