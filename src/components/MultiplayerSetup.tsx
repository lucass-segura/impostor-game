import { useState } from "react";
import { usePeer } from "../context/PeerContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export const MultiplayerSetup = () => {
  const { hostGame, joinGame, hostId } = usePeer();
  const [joinId, setJoinId] = useState("");

  const handleJoin = () => {
    if (!joinId.trim()) {
      toast.error("Please enter a game ID!");
      return;
    }
    joinGame(joinId.trim());
  };

  return (
    <Card className="max-w-md mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Join or Host a Game</h2>
        
        <Button
          onClick={hostGame}
          className="w-full bg-primary hover:bg-primary/90"
        >
          Host New Game
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or join existing game
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            type="text"
            value={joinId}
            onChange={(e) => setJoinId(e.target.value)}
            placeholder="Enter game ID"
            className="flex-1"
          />
          <Button onClick={handleJoin}>Join</Button>
        </div>
      </div>
    </Card>
  );
};