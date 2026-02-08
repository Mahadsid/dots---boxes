"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Player = {
    id: string;
    name: string;
    score: number;
};

export function ScoreBoard({
    players,
    currentTurnPlayerId,
}: {
    players: Player[];
    currentTurnPlayerId: string;
}) {
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Scoreboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {players.map((player) => (
                    <div
                        key={player.id}
                        className={`flex justify-between p-2 rounded ${player.id === currentTurnPlayerId
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                            }`}
                    >
                        <span>{player.name}</span>
                        <span>{player.score}</span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
