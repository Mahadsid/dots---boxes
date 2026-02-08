"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo } from "react";

type Dot = { x: number; y: number };
type Edge = {
    id: string;
    from: Dot;
    to: Dot;
    claimedBy: string | null;
};
type Box = {
    id: string;
    topEdgeId: string;
    rightEdgeId: string;
    bottomEdgeId: string;
    leftEdgeId: string;
    ownerId: string | null;
};

export function GameBoard({
    gameId,
    gridSize,
    edges,
    boxes,
    currentTurnPlayerId,
}: {
    gameId: string;
    gridSize: number;
    edges: Edge[];
    boxes: Box[];
    currentTurnPlayerId: string;
}) {
    const makeMove = useMutation(api.games.makeMove);

    const spacing = 80;
    const padding = 40;
    const size = padding * 2 + spacing * (gridSize - 1);

    const edgeMap = useMemo(() => {
        const map = new Map<string, Edge>();
        edges.forEach((e) => map.set(e.id, e));
        return map;
    }, [edges]);

    async function handleEdgeClick(edgeId: string) {
        try {
            await makeMove({
                gameId,
                playerId: currentTurnPlayerId,
                edgeId,
            });
        } catch (err: any) {
            alert(err.message);
        }
    }

    return (
        <svg
            width={size}
            height={size}
            className=" bg-accent rounded-lg shadow border"
        >
            {/* Render boxes */}
            {boxes.map((box) => {
                if (!box.ownerId) return null;

                const topEdge = edgeMap.get(box.topEdgeId)!;
                const leftEdge = edgeMap.get(box.leftEdgeId)!;

                const x =
                    padding + topEdge.from.x * spacing;
                const y =
                    padding + leftEdge.from.y * spacing;

                return (
                    <rect
                        key={box.id}
                        x={x + 10}
                        y={y + 10}
                        width={spacing - 20}
                        height={spacing - 20}
                        rx={8}
                        fill={box.ownerId === "player1" ? "#60a5fa" : "#f87171"}
                        opacity={0.4}
                    />
                );
            })}

            {/* Render edges */}
            {edges.map((edge) => {
                const x1 = padding + edge.from.x * spacing;
                const y1 = padding + edge.from.y * spacing;
                const x2 = padding + edge.to.x * spacing;
                const y2 = padding + edge.to.y * spacing;

                const isClaimed = !!edge.claimedBy;

                return (
                    <line
                        key={edge.id}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={
                            isClaimed
                                ? edge.claimedBy === "player1"
                                    ? "#2563eb"
                                    : "#dc2626"
                                : "#d1d5db"
                        }
                        strokeWidth={isClaimed ? 6 : 4}
                        strokeLinecap="round"
                        className={!isClaimed ? "cursor-pointer hover:stroke-black" : ""}
                        onClick={() => {
                            if (!isClaimed) handleEdgeClick(edge.id);
                        }}
                    />
                );
            })}

            {/* Render dots */}
            {Array.from({ length: gridSize }).map((_, row) =>
                Array.from({ length: gridSize }).map((_, col) => {
                    const cx = padding + col * spacing;
                    const cy = padding + row * spacing;
                    return (
                        <circle
                            key={`${row}-${col}`}
                            cx={cx}
                            cy={cy}
                            r={6}
                            fill="#111827"
                        />
                    );
                })
            )}
        </svg>
    );
}
