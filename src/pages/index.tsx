import type { NextPage } from "next";

import Hero from "modules/home/components/Hero";
import Board from "modules/home/components/Board";

const Home: NextPage = () => {
  return (
    <>
      <Hero />
      <Board />
    </>
  );
};

export default Home;
