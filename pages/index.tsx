import { styled } from "@stitches/react";
import type { NextPage } from "next";
import Player from "../components/Player";

const Container = styled("div", {
  display: "grid",
  minHeight: "100vh",
  placeContent: "center",
});

const url = "https://archive.org/serve/lady-frankenstein_202210/Lady%20Frankenstein.mp3";

const Home: NextPage = () => {
  return (
    <Container>
      <Player source={url} />
    </Container>
  );
};

export default Home;
