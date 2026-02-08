"use client";

import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { useRouter } from "next/navigation";

const GRID_SIZES = [4, 5, 6, 7];

export function GridSizeSelector() {
    const [gridSize, setGridSize] = useState(4);
    const createGame = useMutation(api.games.createGame);
    const router = useRouter();

    async function handleStartGame() {
        const gameId = await createGame({
            gridSize,
            playerName: "Player 1",
            mode: "localPvP",
        });

        router.push(`/game/${gameId}`);
    }

    return (
        <div className="flex flex-col gap-4 items-center">
            <h2 className="text-xl font-semibold">Choose Grid Size</h2>

            <div className="flex gap-2">
                {GRID_SIZES.map((size) => (
                    <Button
                        key={size}
                        variant={gridSize === size ? "default" : "outline"}
                        onClick={() => setGridSize(size)}
                        className="hover:cursor-pointer"
                    >
                        {size} x {size}
                    </Button>
                ))}
            </div>

            <Button onClick={handleStartGame} className="mt-4 hover:cursor-pointer">
                Start Game
            </Button>
        </div>
    );
}
