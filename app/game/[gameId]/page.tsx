"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { ScoreBoard } from "@/components/ScoreBoard";
import { GameBoard } from "@/components/GameBoard";
import { Header } from "@/components/ui/Header";
import Image from "next/image";
import background from "@/public/background.jpg";
import { toast } from "sonner";
import { useEffect } from "react";
import { TriggerConfetti } from "@/lib/Confetti";


export default function GamePage() {
    const params = useParams();
    const gameId = params.gameId as string;

    const game = useQuery(api.games.getGame, {
        gameId: gameId as any,
    });

    useEffect(() => {
        if (game?.status === "finished") {
            // Calculate the winner
            const winner = game?.players.reduce((prev, curr) =>
                curr.score > prev.score ? curr : prev
            );

            // Trigger the toast
            toast.success(`🎉 Game Over! Winner: ${winner.name}`, {
                description: `Final Score: ${winner.score}`,
                position: "top-center"
            });

            setTimeout(() => {
                TriggerConfetti();
            }, 10);
        }
    }, [game?.status, game?.players]);

    if (!game) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p>Loading game...</p>
            </main>
        );
    }


    return (
        <>
            <div className="relative min-h-screen w-full">
                {/* Background Image */}
                <div className="fixed inset-0 -z-10 dark:hidden">
                    <Image
                        src={background}
                        alt="Background"
                        quality={100}
                        fill // makes the image fill the parent element
                        className="bg-cover dark:hidden"
                        // Add priority if the image is above the fold (LCP element)
                        priority
                    />
                </div>


                <div className="relative z-11"><Header onMarketingPage={false} /></div>
                <div className="min-h-screen flex flex-col items-center gap-6 p-6 relative z-10 pt-24">

                    <ScoreBoard
                        players={game.players}
                        currentTurnPlayerId={game.currentTurnPlayerId}
                    />

                    <GameBoard
                        gameId={game._id}
                        gridSize={game.gridSize}
                        edges={game.edges}
                        boxes={game.boxes}
                        currentTurnPlayerId={game.currentTurnPlayerId}
                    />
                </div>
            </div>
        </>
    );
}
