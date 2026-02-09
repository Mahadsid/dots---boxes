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
import { useEffect, useState } from "react";
import { TriggerConfetti } from "@/lib/Confetti";
import { Button } from "@/components/ui/button";
import { ShareGameModal } from "@/components/ShareGameModal";


export default function GamePage() {
    const params = useParams();
    const gameId = params.gameId as string;

    const game = useQuery(api.games.getGame, {
        gameId: gameId as any,
    });

    const [shareOpen, setShareOpen] = useState(false);

    useEffect(() => {
        if (!game || game.status !== "finished") return;

        const localPlayerId = localStorage.getItem(`dots-boxes-role-${game._id}`);
        if (!localPlayerId) return;

        const winner = game.players.reduce((prev, curr) =>
            curr.score > prev.score ? curr : prev
        );

        const localPlayer = game.players.find(p => p.id === localPlayerId);

        if (!localPlayer) return;

        if (localPlayer.id === winner.id) {
            toast.success(`🎉 Congratulations ${localPlayer.name}! You won!`, {
                description: `Final Score: ${localPlayer.score}`,
                position: "top-center",
            });

            setTimeout(() => {
                TriggerConfetti();
            }, 10);
        } else {
            toast.error(`🤡 Hold this 'L'.`, {
                description: `Winner is  ${winner.name} with score: ${winner.score}`,
                position: "top-center",
            });
        }
    }, [game?.status]);


    if (!game) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p>Loading game...</p>
            </main>
        );
    }

    const isWaiting = game.status === "waiting";


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

                    {isWaiting && (
                        <div className="flex flex-col items-center gap-3">
                            <p className="text-lg font-medium">
                                Waiting for another player to join...
                            </p>
                            <Button onClick={() => setShareOpen(true)}>
                                Share Game Code
                            </Button>
                        </div>
                    )}

                    {!isWaiting && (
                        <GameBoard
                            gameId={game._id}
                            gridSize={game.gridSize}
                            edges={game.edges}
                            boxes={game.boxes}
                            currentTurnPlayerId={game.currentTurnPlayerId}
                            players={game.players}
                        />
                    )}

                    <ShareGameModal
                        open={shareOpen}
                        onOpenChange={setShareOpen}
                        gameId={game._id}
                    />
                </div>
            </div>
        </>
    );
}
