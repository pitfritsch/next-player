import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { MainContainer } from ".";
import Player from "../components/Player";
import useSsr from "../hooks/useSsr";
import useStorage from "../hooks/useStorage";

export default function PlayerPage() {
  const { isBrowser } = useSsr();
  const router = useRouter();
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [audios] = useStorage<{ id: string; source: string }[]>("audios", [], "localStorage");

  const { id } = router.query;
  if (!id) {
    <h1>please select an audio</h1>;
  }

  const getSource = useCallback(() => {
    if (!isBrowser || !id) return;
    const data = audios.find((audio) => audio.id === id);
    if (!data) return console.log("nao achou");

    setAudio(new Audio(`/api/media/${btoa(data.source)}`));
  }, [id]);

  useEffect(() => {
    getSource();
  }, [getSource]);

  return <MainContainer>{audio && <Player audio={audio} />}</MainContainer>;
}
