import { useEffect, useState } from "react";
import { Slider } from "./Slider";

export const ConsiderIt = () => {
  const [isOpining, setIsOpining] = useState(false);
  const [opinion, setOpinion] = useState("Slide Your Overall Opinion");
  const [acceptance, setAcceptance] = useState(0.5);

  useEffect(() => {
    if (acceptance < 0.01) {
      setOpinion("You Fully Disagree");
    } else if (acceptance < 0.23) {
      setOpinion("You Firmly Disagree");
    } else if (acceptance < 0.45) {
      setOpinion("You Slightly Disagree");
    } else if (acceptance < 0.55) {
      setOpinion("You Are Undecided");
    } else if (acceptance < 0.77) {
      setOpinion("You Slightly Agree");
    } else if (acceptance < 0.99) {
      setOpinion("You Firmly Agree");
    } else {
      setOpinion("You Fully Agree");
    }
  }, [acceptance]);

  return (
    <Slider
      isOpining={isOpining}
      setIsOpining={setIsOpining}
      opinion={opinion}
      acceptance={acceptance}
      setAcceptance={setAcceptance}
    />
  );
};
