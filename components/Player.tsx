import { styled } from "@stitches/react";
import { useEffect, useRef, useState } from "react";
import { Pause, RotateCcw, RotateCw } from "react-feather";
import useSsr from "../hooks/useSsr";

const PlayerContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
});

const ButtonsContainer = styled("div", {
  display: "flex",
  gap: "10px",
  justifyContent: "center",
});

const Slider = styled("input", {
  width: "calc(100vw - 20px)",
  maxWidth: "500px",
});

interface PlayerProps {
  source: string;
}
export default function Player({ source }: PlayerProps) {
  const { isBrowser } = useSsr();

  const audioRef = useRef(isBrowser ? new Audio(source) : null);
  const intervalRef = useRef<any>();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const { duration } = audioRef.current || {};

  const updateCurrentTime = () => {
    setCurrentTime(audioRef.current?.currentTime || 0);
  };

  function handlePlayPause() {
    if (!audioRef.current) return;

    if (isPlaying) {
      setIsPlaying(false);
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    } else {
      setIsPlaying(true);
      audioRef.current.play();
      intervalRef.current = setInterval(updateCurrentTime, 1000);
    }
  }

  function goBack() {
    if (!audioRef.current) return;
    audioRef.current.currentTime -= 10;
  }
  function goForward() {
    if (!audioRef.current) return;
    audioRef.current.currentTime += 10;
  }

  return (
    <PlayerContainer>
      <Slider type="range" min={0} step={1} max={duration || 0} value={currentTime} />
      <ButtonsContainer>
        <button onClick={goBack}>
          <RotateCcw size={14} />
        </button>
        <button onClick={handlePlayPause}>
          <Pause />
        </button>
        <button onClick={goForward}>
          <RotateCw size={14} />
        </button>
      </ButtonsContainer>
    </PlayerContainer>
  );
}
