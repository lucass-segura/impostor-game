import { useState } from "react";
import { usePeer } from "../context/PeerContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Copy } from "lucide-react";

type SetupState = "initial" | "hosting" | "joining";

export const MultiplayerSetup = () => {
  const { hostGame, joinGame, hostId } = usePeer();
  const [setupState, setSetupState] = useState<SetupState>("initial");
  const [joinId, setJoinId] = useState("");
  const [username, setUsername] = useState("");

  const handleJoin = () => {
    if (!joinId.trim()) {
      toast.error("Please enter a game ID!");
      return;
    }
    if (!username.trim()) {
      toast.error("Please enter your username!");
      return;
    }
    joinGame(joinId.trim(), username.trim());
  };

  const handleHost = () => {
    if (!username.trim()) {
      toast.error("Please enter your username!");
      return;
    }
    hostGame(username.trim());
  };

  const copyGameId = () => {
    if (hostId) {
      navigator.clipboard.writeText(hostId);
      toast.success("Game ID copied to clipboard!");
    }
  };

  if (hostId) {
    return (
      <Card className="max-w-md mx-auto p-6 space-y-6 glass-morphism">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center text-gradient">Game Lobby</h2>
          <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
            <p className="text-sm text-muted-foreground">Game ID:</p>
            <div className="flex items-center gap-2">
              <code className="bg-accent/20 px-2 py-1 rounded">{hostId}</code>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyGameId}
                className="hover:bg-white/5"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (setupState === "hosting") {
    return (
      <Card className="max-w-md mx-auto p-6 space-y-6 glass-morphism">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center text-gradient">Host New Game</h2>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full bg-secondary/20"
          />
          <div className="flex gap-2">
            <Button
              onClick={() => setSetupState("initial")}
              variant="outline"
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleHost}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Start Game
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (setupState === "joining") {
    return (
      <Card className="max-w-md mx-auto p-6 space-y-6 glass-morphism">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center text-gradient">Join Game</h2>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full bg-secondary/20"
          />
          <Input
            type="text"
            value={joinId}
            onChange={(e) => setJoinId(e.target.value)}
            placeholder="Enter game ID"
            className="w-full bg-secondary/20"
          />
          <div className="flex gap-2">
            <Button
              onClick={() => setSetupState("initial")}
              variant="outline"
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleJoin}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Join Game
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto p-6 space-y-6 glass-morphism">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-center text-gradient">Welcome to the Game</h1>
        <Button
          onClick={() => setSetupState("hosting")}
          className="w-full bg-primary hover:bg-primary/90"
        >
          Host New Game
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-accent px-2 text-muted-foreground">
              Or join existing game
            </span>
          </div>
        </div>
        <Button
          onClick={() => setSetupState("joining")}
          variant="outline"
          className="w-full"
        >
          Join Game
        </Button>
      </div>
    </Card>
  );
};