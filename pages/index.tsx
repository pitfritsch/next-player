import { styled } from "@stitches/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import useStorage from "../hooks/useStorage";
import { create_UUID } from "../utils/utils";

export const MainContainer = styled("div", {
  display: "grid",
  minHeight: "100vh",
  placeContent: "center",
  gap: "20px",
});
const url = "http://archive.org/serve/lady-frankenstein_202210/Lady%20Frankenstein.mp3";
// const url =
//   "https://portal.sacocheio.tv/programacao/uploads/4/ntuefvu4pp1/cacb796c58e06df0b058be630f9809ca.mp3";

const InputGroup = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "5px",

  "&>label": {
    fontSize: "12px",
  },
  "&>input": {
    padding: "5px 10px",
  },
});

const Home: NextPage = () => {
  const router = useRouter();
  const [source, setSource] = useState<string>(url);
  const [audios, setAudios] = useStorage<{ id: string; source: string }[]>(
    "audios",
    [],
    "localStorage"
  );

  const chooseSource = (source: string) => {
    const newAudios = audios;
    const id = create_UUID();
    newAudios.push({ id, source });
    setAudios(newAudios);
    router.push(id);
  };

  return (
    <MainContainer>
      <InputGroup>
        <label htmlFor="url">Audio URL</label>
        <input
          placeholder="Audio URL"
          name="url"
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
      </InputGroup>
      <button onClick={() => chooseSource(source)}>set</button>
    </MainContainer>
  );
};

export default Home;
