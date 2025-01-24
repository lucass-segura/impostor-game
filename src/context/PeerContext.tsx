import React, { createContext, useContext, useEffect, useState } from "react";
import Peer from "peerjs";
import { useGame } from "./GameContext";
import { toast } from "sonner";
import { GameState } from "../types/game";

interface PeerContextType {
  peer: Peer | null;
  connections: Record<string, Peer.DataConnection>;
  hostId: string | null;
  isHost: boolean;
  hostGame: () => void;
  joinGame: (hostId: string) => void;
  sendGameState: (state: GameState) => void;
}

const PeerContext = createContext<PeerContextType | undefined>(undefined);

export const PeerProvider = ({ children }: { children: React.ReactNode }) => {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [connections, setConnections] = useState<Record<string, Peer.DataConnection>>({});
  const [hostId, setHostId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const { gameState, setGameState } = useGame();

  useEffect(() => {
    const newPeer = new Peer();
    
    newPeer.on("open", (id) => {
      console.log("My peer ID is:", id);
      setPeer(newPeer);
    });

    newPeer.on("error", (error) => {
      console.error("Peer error:", error);
      toast.error("Connection error occurred");
    });

    newPeer.on("connection", (conn) => {
      console.log("Incoming connection from:", conn.peer);
      
      conn.on("data", (data: GameState) => {
        console.log("Received game state:", data);
        setGameState(data);
      });

      setConnections(prev => ({ ...prev, [conn.peer]: conn }));
    });

    return () => {
      newPeer.destroy();
    };
  }, []);

  const hostGame = () => {
    if (!peer) return;
    setIsHost(true);
    setHostId(peer.id);
    toast.success(`Game hosted! Share this ID with players: ${peer.id}`);
  };

  const joinGame = (hostId: string) => {
    if (!peer) return;
    
    const conn = peer.connect(hostId);
    
    conn.on("open", () => {
      setConnections(prev => ({ ...prev, [hostId]: conn }));
      setHostId(hostId);
      toast.success("Connected to game!");
    });

    conn.on("data", (data: GameState) => {
      console.log("Received game state:", data);
      setGameState(data);
    });
  };

  const sendGameState = (state: GameState) => {
    Object.values(connections).forEach(conn => {
      conn.send(state);
    });
  };

  return (
    <PeerContext.Provider
      value={{
        peer,
        connections,
        hostId,
        isHost,
        hostGame,
        joinGame,
        sendGameState,
      }}
    >
      {children}
    </PeerContext.Provider>
  );
};

export const usePeer = () => {
  const context = useContext(PeerContext);
  if (!context) {
    throw new Error("usePeer must be used within a PeerProvider");
  }
  return context;
};