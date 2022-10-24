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
  alignItems: "center",
  "&>button": {
    backgroundColor: "#3e3e3e",
    display: "flex",
    alignItems: "center",
    borderRadius: "100px",
    border: "none",
    padding: "10px",
    cursor: "pointer",
    transition: "150ms",

    "&:hover, &:focus": {
      transform: "scale(1.1)",
    },

    "&:active": {
      transform: "scale(1.05)",
    },
  },
});

const Slider = styled("input", {
  width: "calc(100vw - 20px)",
  maxWidth: "500px",
});

const Timers = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  padding: "0 10px",
  "&>span": {
    fontSize: "12px",
  },
});

interface PlayerProps {
  audio: HTMLAudioElement | null;
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
    const interval = setInterval(() => setCurrentTime(audioRef.current?.currentTime || 0), 1000);
    return () => clearInterval(interval);
  }, []);

  const changeTime = useCallback(
    (newTime: number) => {
      if (!audioRef.current) return;
      audioRef.current.currentTime = newTime;
    },
    [audioRef.current]
  );

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
      <Timers>
        <span>{convertSecondsToReadable(currentTime)}</span>
        {!!duration && <span>{convertSecondsToReadable(duration || 0)}</span>}
      </Timers>
    </>
  );
}

export default function Player({ audio }: PlayerProps) {
  const { isBrowser } = useSsr();

  const audioRef = useRef<HTMLAudioElement | null>(audio);

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
    if (!audio) return;

    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    audioRef.current = audio;
  }, [audio]);

  return (
    <PlayerContainer>
      {audioRef.current && <Controller duration={duration} audioRef={audioRef} />}
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
