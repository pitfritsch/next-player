import { styled } from "@stitches/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, RotateCw } from "react-feather";
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

// const

interface PlayerProps {
  source: string;
}

interface ControllerProps {
  duration: number;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
}

function convertSecondsToReadable(seconds: number) {
  return new Date(seconds * 1000).toISOString().slice(11, 19);
}

function Controller({ duration, audioRef }: ControllerProps) {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    setInterval(() => setCurrentTime(audioRef.current?.currentTime || 0), 1000);
  }, []);

  const changeTime = useCallback((newTime: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = newTime;
  }, []);

  return (
    <>
      <Slider
        type="range"
        min={0}
        step={1}
        max={duration}
        value={currentTime}
        onChange={(e) => changeTime(Number(e.target.value))}
      />
      <span>{convertSecondsToReadable(currentTime)}</span>
      <span>{convertSecondsToReadable(duration || 0)}</span>
    </>
  );
}

export default function Player({ source }: PlayerProps) {
  const { isBrowser } = useSsr();

  const audioRef = useRef(isBrowser ? new Audio(source) : null);

  const { duration = 0 } = audioRef.current || {};

  const [isPlaying, setIsPlaying] = useState(false);

  function handlePlayPause() {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
      if (isBrowser && "mediaSession" in navigator) {
        navigator.mediaSession.setActionHandler("previoustrack", goBack);
        navigator.mediaSession.setActionHandler("nexttrack", goForward);
      }
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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onplay = () => setIsPlaying(true);
      audioRef.current.onpause = () => setIsPlaying(false);
    }
  }, [audioRef.current]);

  return (
    <PlayerContainer>
      <Controller duration={duration || 0} audioRef={audioRef} />
      <ButtonsContainer>
        <button onClick={goBack}>
          <RotateCcw size={14} />
        </button>
        <button onClick={handlePlayPause}>{isPlaying ? <Pause /> : <Play />}</button>
        <button onClick={goForward}>
          <RotateCw size={14} />
        </button>
      </ButtonsContainer>
    </PlayerContainer>
  );
}
