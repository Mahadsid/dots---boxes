"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function JoinGameModal({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [gameId, setGameId] = useState("");
    const [playerName, setPlayerName] = useState("");
    const [loading, setLoading] = useState(false);

    const joinGame = useMutation(api.games.joinGame);
    const router = useRouter();

    async function handleJoin() {
        if (!gameId.trim()) {
            toast.error("Please enter a game code.");
            return;
        }

        setLoading(true);
        try {
            await joinGame({
                gameId: gameId.trim() as any,
                playerName,
            });
            toast.success("Joined game successfully!");
            localStorage.setItem(`dots-boxes-role-${gameId.trim()}`, "player2");
            router.push(`/game/${gameId.trim()}`);
            onOpenChange(false);
        } catch (err: any) {
            toast.error(err.message || "Failed to join game.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Join Game</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    <Input
                        placeholder="Enter Game Code"
                        value={gameId}
                        onChange={(e) => setGameId(e.target.value)}
                        disabled={loading}
                    />

                    <Input
                        placeholder="Your Name (optional)"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        disabled={loading}
                    />

                    <Button onClick={handleJoin} disabled={loading}>
                        {loading ? "Joining..." : "Join Game"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
