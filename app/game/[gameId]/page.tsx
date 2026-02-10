"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { ScoreBoard } from "@/components/ScoreBoard";
import { GameBoard } from "@/components/GameBoard";
import { Header } from "@/components/ui/Header";
import Image from "next/image";
import background from "@/public/background.jpg";
import { toast } from "sonner";
import { useEffect, useState, useRef } from "react";
import { TriggerConfetti } from "@/lib/Confetti";
import { Button } from "@/components/ui/button";
import { ShareGameModal } from "@/components/ShareGameModal";
import { ReplayModal } from "@/components/ReplayModal";
import { ReplayRequestModal } from "@/components/ReplayRequestModal";

export default function GamePage() {
    const params = useParams();
    const router = useRouter();
    const gameId = params.gameId as string;

    const game = useQuery(api.games.getGame, {
        gameId: gameId as any,
    });

    const requestReplay = useMutation(api.games.requestReplay);
    const respondToReplay = useMutation(api.games.respondToReplay);

    const [shareOpen, setShareOpen] = useState(false);

    const localPlayerId =
        typeof window !== "undefined"
            ? localStorage.getItem(`dots-boxes-role-${gameId}`)
            : null;

    // prevents winner/loser toast + confetti from running multiple times
    //const hasShownGameResultRef = useRef(false);BUG: It doesnot confetti on rematch win.

    // Redirect BOTH players when replay is declined
    const prevReplayStatusRef = useRef<string | null>(null);

    useEffect(() => {
        if (!game || game.status !== "finished") return;
        if (!localPlayerId) return;

        // run only once per game finish BUG: It doesnot confetti on rematch win.
        // if (hasShownGameResultRef.current) return;
        // hasShownGameResultRef.current = true;

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



    const isWaiting = game?.status === "waiting";

    const replayRequestedBy = game?.replayRequest?.requestedBy || null;
    const isReplayRequester = replayRequestedBy === localPlayerId;
    const isReplayResponder =
        !!replayRequestedBy && replayRequestedBy !== localPlayerId;

    const winner = game?.players.reduce((prev, curr) =>
        curr.score > prev.score ? curr : prev
    );

    const localPlayer = game?.players.find(p => p.id === localPlayerId);
    const isWinner = localPlayer?.id === winner?.id;
    const isLoser = localPlayer && !isWinner;



    useEffect(() => {
        if (!game) return;

        // Detect transition: replay_pending → finished
        if (
            prevReplayStatusRef.current === "replay_pending" &&
            game.status === "finished" &&
            !game.replayRequest
        ) {
            toast.error("Replay request was declined.");
            router.push("/");
        }

        prevReplayStatusRef.current = game.status;
    }, [game?.status, game?.replayRequest, router]);

    if (!game) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="flex items-center gap-4">
                    {/* Spinner */}
                    <div className="h-4 w-4 animate-spin rounded-full border-4 border-muted border-t-primary" />

                    {/* Text */}
                    <p className="text-2xl font-semibold tracking-tight text-foreground">
                        Loading game...
                    </p>
                </div>
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
                        fill
                        className="bg-cover dark:hidden"
                        priority
                    />
                </div>

                <div className="relative z-11">
                    <Header onMarketingPage={false} />
                </div>

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

                {/*Replay modal for LOSER */}
                <ReplayModal
                    open={
                        game.status === "finished" &&
                        !!localPlayer &&
                        isLoser &&
                        !game.replayRequest
                    }
                    onReplay={async () => {
                        try {
                            await requestReplay({
                                gameId: game._id,
                                playerId: localPlayerId!,
                            });
                            toast.success("Replay challenge sent!");
                        } catch (err: any) {
                            toast.error(err.message);
                        }
                    }}
                    onExit={() => router.push("/")}
                />

                {/*Waiting overlay for challenger */}
                {game.status === "replay_pending" && isReplayRequester && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                        <div className="bg-card border border-border p-10 rounded-xl shadow-2xl text-center max-w-sm w-full mx-4">
                            <p className="text-2xl font-semibold text-card-foreground tracking-tight">
                                Waiting for opponent to respond...
                            </p>
                        </div>
                    </div>
                )}

                {/* Replay request modal for opponent */}
                <ReplayRequestModal
                    open={game.status === "replay_pending" && isReplayResponder}
                    challengerName={
                        game.players.find(p => p.id === replayRequestedBy)?.name ||
                        "Opponent"
                    }
                    onAccept={async () => {
                        try {
                            await respondToReplay({
                                gameId: game._id,
                                playerId: localPlayerId!,
                                accept: true,
                            });
                            toast.success("Replay accepted! Game restarted.");
                            // Reset result flag for new game, BUG: It doesnot confetti on rematch win.
                            //hasShownGameResultRef.current = false;
                        } catch (err: any) {
                            toast.error(err.message);
                        }
                    }}
                    onDecline={async () => {
                        try {
                            await respondToReplay({
                                gameId: game._id,
                                playerId: localPlayerId!,
                                accept: false,
                            });
                            router.push("/");
                        } catch (err: any) {
                            toast.error(err.message);
                        }
                    }}
                />
            </div>
        </>
    );
}
