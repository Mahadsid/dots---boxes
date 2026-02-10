"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export function ReplayRequestModal({
    open,
    challengerName,
    onAccept,
    onDecline,
}: {
    open: boolean;
    challengerName: string;
    onAccept: () => void;
    onDecline: () => void;
}) {
    return (
        <Dialog open={open}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Replay Challenge</DialogTitle>
                </DialogHeader>
                <p>{challengerName} has challenged you for another game.</p>
                <div className="flex gap-2 justify-end mt-4">
                    <Button variant="outline" onClick={onDecline}>
                        Decline
                    </Button>
                    <Button onClick={onAccept}>Accept</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
