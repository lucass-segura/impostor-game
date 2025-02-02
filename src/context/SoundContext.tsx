import { createContext, useContext, useEffect, useState } from "react";

const SoundContext = createContext<{
  playSound: (src: string) => void;
  isMuted: boolean;
  toggleMute: () => void;
}>({
  playSound: () => {},
  isMuted: false,
  toggleMute: () => {},
});

export const SoundProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMuted, setIsMuted] = useState(false);

//   useEffect(() => {
//     const audio = new Audio('/sounds/vote.mp3');
//     audio.load(); // Preload Sound
//   }, []);

  const playSound = (src: string) => {
    if (!isMuted) {
      const audio = new Audio(src);
      audio.play();
    }
  };

  const toggleMute = () => setIsMuted((prev) => !prev);

  return (
    <SoundContext.Provider value={{ playSound, isMuted, toggleMute }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => useContext(SoundContext);