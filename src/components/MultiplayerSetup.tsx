import { useState, useEffect } from "react";
import { usePeer } from "../context/PeerContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Users, UserPlus, Copy, Link } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const MultiplayerSetup = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { hostGame, joinGame, hostId } = usePeer();
  const [showJoinForm, setShowJoinForm] = useState(searchParams.get("gameId") != undefined);
  const [showHostForm, setShowHostForm] = useState(false);
  const [joinId, setJoinId] = useState(showJoinForm ? searchParams.get("gameId") : "");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const gameId = searchParams.get("gameId");
    if (gameId) {
      setJoinId(gameId);
      setShowJoinForm(true);
    }
  }, [searchParams]);

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

  return (
    <Card className="max-w-md mx-auto p-6 space-y-6 animate-fade-in glass-morphism">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center text-gradient">{t('welcome')}</h2>

        {!showHostForm && !showJoinForm && (
          <div className="space-y-4">
            <Button
              onClick={() => setShowHostForm(true)}
              className="w-full bg-primary hover:bg-primary/90 transition-colors duration-200"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Host New Game
            </Button>

            <div className="relative flex items-center">
              <span className="flex-grow border-t border-white/10"></span>
              <span className="px-4 text-xs uppercase text-muted-foreground">
                Or join existing game
              </span>
              <span className="flex-grow border-t border-white/10"></span>
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