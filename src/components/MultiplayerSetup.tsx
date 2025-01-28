import { useState } from "react";
import { usePeer } from "../context/PeerContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Users, UserPlus, Copy } from "lucide-react";

export const MultiplayerSetup = () => {
  const { hostGame, joinGame, hostId } = usePeer();
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showHostForm, setShowHostForm] = useState(false);
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

  const handleCopyId = () => {
    if (hostId) {
      navigator.clipboard.writeText(hostId);
      toast.success("Game ID copied to clipboard!");
    }
  };

  if (hostId) {
    return (
      <Card className="max-w-md mx-auto p-6 space-y-6 animate-fade-in glass-morphism">
        <h2 className="text-2xl font-bold text-center text-gradient">Game Lobby</h2>
        <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
          <span className="text-sm text-muted-foreground">Game ID:</span>
          <div className="flex items-center gap-2">
            <code className="bg-secondary/30 px-3 py-1 rounded">{hostId}</code>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyId}
              className="hover:bg-secondary/20"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto p-6 space-y-6 animate-fade-in glass-morphism">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center text-gradient">Welcome to Undercover</h2>
        
        {!showHostForm && !showJoinForm && (
          <div className="space-y-4">
            <Button
              onClick={() => setShowHostForm(true)}
              className="w-full bg-primary hover:bg-primary/90 transition-colors duration-200"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Host New Game
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#242A38] px-2 text-muted-foreground">
                  Or join existing game
                </span>
              </div>
            </div>

            <Button
              onClick={() => setShowJoinForm(true)}
              className="w-full bg-secondary hover:bg-secondary/90 transition-colors duration-200"
            >
              <Users className="mr-2 h-4 w-4" />
              Join Game
            </Button>
          </div>
        )}

        {showHostForm && (
          <div className="space-y-4 animate-fade-in">
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full bg-secondary/20 border-secondary/30"
            />
            <Button
              onClick={handleHost}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Start Hosting
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowHostForm(false)}
              className="w-full"
            >
              Back
            </Button>
          </div>
        )}

        {showJoinForm && (
          <div className="space-y-4 animate-fade-in">
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full bg-secondary/20 border-secondary/30"
            />
            <Input
              type="text"
              value={joinId}
              onChange={(e) => setJoinId(e.target.value)}
              placeholder="Enter game ID"
              className="w-full bg-secondary/20 border-secondary/30"
            />
            <Button
              onClick={handleJoin}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Join Game
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowJoinForm(false)}
              className="w-full"
            >
              Back
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};