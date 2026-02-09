"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function ShareGameModal({
    open,
    onOpenChange,
    gameId,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    gameId: string;
}) {
    async function handleCopy() {
        await navigator.clipboard.writeText(gameId);
        toast.success("Game code copied to clipboard!");
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Share Game Code</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    <Input value={gameId} readOnly />

                    <Button onClick={handleCopy}>Copy Code</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
