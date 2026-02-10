"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export function ReplayModal({
    open,
    onReplay,
    onExit,
}: {
    open: boolean | undefined;
    onReplay: () => void;
    onExit: () => void;
}) {
    return (
        <Dialog open={open}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Game Over</DialogTitle>
                </DialogHeader>
                <p>You lost the game. Want to challenge for a rematch?</p>
                <div className="flex gap-2 justify-end mt-4">
                    <Button variant="outline" onClick={onExit}>
                        Exit
                    </Button>
                    <Button onClick={onReplay}>Re-challenge</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
