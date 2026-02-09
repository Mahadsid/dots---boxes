"use client";

import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { JoinGameModal } from "./JoinGameModal";
import { Input } from "./ui/input";

const GRID_SIZES = [4, 5, 6, 7];

export function GridSizeSelector() {
    const [gridSize, setGridSize] = useState(4);
    const [hostName, setHostName] = useState("");
    const [joinOpen, setJoinOpen] = useState(false);

    const createHostedGame = useMutation(api.games.createHostedGame);
    const router = useRouter();

    async function handleHostGame() {
        const gameId = await createHostedGame({
            gridSize,
            hostName,
        });
        localStorage.setItem(`dots-boxes-role-${gameId}`, "player1");
        router.push(`/game/${gameId}`);
    }

    return (
        <div className="flex flex-col gap-4 items-center">

            <div className="w-full flex flex-col gap-4">
                {/* Appealing Heading */}
                <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                    Enter your name
                </h2>

                <div className="w-full">
                    <Input
                        placeholder="Your Name (optional)"
                        value={hostName}
                        onChange={(e) => setHostName(e.target.value)}
                        // Enhanced visibility: stronger border, focus ring, and dark mode contrast
                        className="border-slate-400 dark:border-slate-600 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all duration-200"
                    />
                </div>
            </div>

            <h2 className="text-xl font-bold">Choose Grid Size</h2>

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

            <div className="flex gap-4 w-full">
                <Button className="flex-1 hover:cursor-pointer" onClick={handleHostGame}>
                    Host Game
                </Button>

                <Button
                    className="flex-1 hover:cursor-pointer"
                    variant="outline"
                    onClick={() => setJoinOpen(true)}
                >
                    Join Game
                </Button>
            </div>

            <JoinGameModal open={joinOpen} onOpenChange={setJoinOpen} />

            {/* <Button onClick={handleStartGame} className="mt-4 hover:cursor-pointer">
                Start Game
            </Button> */}
        </div>
    );
}
