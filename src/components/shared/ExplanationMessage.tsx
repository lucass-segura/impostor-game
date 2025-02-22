import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { PlayerRole } from '@/types/game';

interface ExplanationMessageProps {
  role: PlayerRole;
  onClose: () => void;
}

export const ExplanationMessage = ({ role, onClose }: ExplanationMessageProps) => {
  const messages = {
    mrwhite: {
      title: "You are Mr. White!",
      content: "Your goal is to blend in without knowing the word. Listen carefully to others' descriptions and try to guess the word. When it's your turn, give a description that sounds like you know what everyone's talking about!"
    },
    civilian: {
      title: "You are a Civilian",
      content: "You know the secret word! When it's your turn, describe it without saying it directly. Be clever - you want other civilians to understand you, but keep Mr. White guessing!"
    },
    undercover: {
      title: "You are Undercover!",
      content: "You have a different word than the civilians! Try to blend in by giving descriptions that could match both words. Be careful not to give away that you have a different word!"
    }
  };

  const message = messages[role];

  // Don't render anything for spectators or if no valid message
  if (role === 'spectator' || !message) {
    return null;
  }

  return (
    <Card className="relative p-4 mb-6 bg-primary/10 border-primary/20 text-white animate-fade-in">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded-full"
      >
        <X size={16} />
      </button>
      <h3 className="font-bold mb-2">{message.title}</h3>
      <p className="text-sm text-white/90">{message.content}</p>
    </Card>
  );
}; 