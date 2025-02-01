import React, { createContext, useContext, useEffect, useState } from "react";
import { Peer, DataConnection } from "peerjs";
import { useGame } from "./GameContext";
import { toast } from "sonner";
import { GameState } from "../types/game";

interface PeerContextType {
  peer: Peer | null;
  connections: Record<string, DataConnection>;
  hostId: string | null;
  isHost: boolean;
  hostGame: (username: string) => void;
  joinGame: (hostId: string, username: string) => void;
  sendGameState: (state: GameState) => void;
  sendToHost: (data: any) => void;
}

const PeerContext = createContext<PeerContextType | undefined>(undefined);

export const PeerProvider = ({ children }: { children: React.ReactNode }) => {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [connections, setConnections] = useState<Record<string, DataConnection>>({});
  const [hostId, setHostId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const { gameState, removePlayer } = useGame();

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
      
      conn.on("open", () => {
        setConnections(prev => ({ ...prev, [conn.peer]: conn }));
        if (gameState) {
          conn.send({ type: "GAME_STATE", state: gameState });
        }
      });

      conn.on("close", () => {
        console.log("Connection closed with:", conn.peer);
        setConnections(prev => {
          const newConnections = { ...prev };
          delete newConnections[conn.peer];
          return newConnections;
        });
        
        if (isHost) {
          removePlayer(conn.peer);
          toast.error(`${gameState.players.find(p => p.id === conn.peer)?.name || 'A player'} disconnected`);
        }
      });

      conn.on("data", (data: any) => {
        console.log("Received data:", data);
        switch (data.type) {
          case "JOIN_GAME":
            console.log("New player joining:", data.username);
            addPlayer(data.username, conn.peer);
            conn.send({ type: "GAME_STATE", state: gameState });
            break;
          case "GAME_STATE":
            console.log("Received game state:", data.state);
            setGameState(data.state);
            break;
          case "SUBMIT_VOTE":
            console.log("Received vote:", data);
            submitVote(data.voterId, data.targetId);
            break;
          case "MR_WHITE_GUESS":
            console.log("Received Mr. White guess:", data);
            submitMrWhiteGuess(data.guess);
            break;
          default:
            console.log("Unknown data type:", data.type);
        }
      });
    });

    return () => {
      newPeer.destroy();
    };
  }, []);

  const hostGame = (username: string) => {
    if (!peer) return;
    console.log("Hosting game with peer ID:", peer.id);
    setIsHost(true);
    setHostId(peer.id);
    addPlayer(username, peer.id);
    toast.success(`Game hosted! Share this ID with players: ${peer.id}`);
  };

  const joinGame = (hostId: string, username: string) => {
    if (!peer) return;
    
    const conn = peer.connect(hostId);
    console.log("Joining game with peer ID:", peer.id);
    
    conn.on("open", () => {
      setConnections(prev => ({ ...prev, [hostId]: conn }));
      setHostId(hostId);
      conn.send({ type: "JOIN_GAME", username });
      toast.success("Connected to game!");
    });

    conn.on("data", (data: any) => {
      console.log("Received data in connection:", data);
      if (data.type === "GAME_STATE") {
        console.log("Setting received game state:", data.state);
        setGameState(data.state);
      }
    });
  };

  const sendGameState = (state: GameState) => {
    console.log("Sending game state to all connections:", state);
    Object.values(connections).forEach(conn => {
      conn.send({ type: "GAME_STATE", state });
    });
  };

  const sendToHost = (data: any) => {
    if (!hostId || !connections[hostId]) {
      console.error("No connection to host");
      return;
    }
    console.log("Sending data to host:", data);
    connections[hostId].send(data);
  };

  useEffect(() => {
    if (isHost && Object.keys(connections).length > 0) {
      console.log("Host sending updated game state to all connections");
      sendGameState(gameState);
    }
  }, [gameState, isHost, connections]);

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
        sendToHost,
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
