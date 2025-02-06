import { useGame } from "@/context/GameContext";
import { GameState } from "@/types/game";
import { CheckCircle, XCircle } from "lucide-react";

export const MrWhiteGuess = () => {
    const { gameState } = useGame();

    if (!gameState.mrWhiteGuess) return null;

    const isCorrect = gameState.mrWhiteGuess.toLowerCase() === gameState.majorityWord.toLowerCase();
    return (
      <div className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
        <div className="flex items-center gap-2">
          {isCorrect ? (
            <CheckCircle className="text-green-500" />
          ) : (
            <XCircle className="text-red-500" />
          )}
          <p className="text-white">
            Mr. White guessed: <span className="font-bold">{gameState.mrWhiteGuess}</span>
          </p>
        </div>
      </div>
    );
};