import { FC, useEffect, useRef, useState } from "react";

import { HistogramAvatar } from "./HistogramAvatar";
import { positionAvatars } from "./helpers";
import { useOpinion } from "modules/claims/hooks/useOpinion";

export const Histogram: FC<{}> = ({ opinions, handleShowOpinion }) => {
  const { isOpining, setIsOpining } = useOpinion();
  const histogram = useRef(null);
  const [nodes, setNodes] = useState([]);

  const handleClick = () => setIsOpining(false);

  useEffect(() => {
    if (histogram.current) {
      const nodes = positionAvatars(
        opinions,
        histogram.current.offsetWidth,
        histogram.current.offsetHeight
      );
      setNodes(nodes);
    }
  }, [opinions, histogram]);

  return (
    <div
      ref={histogram}
      style={{
        height: 200,
        position: "relative",
        opacity: isOpining ? 0.35 : 1,
        transition: ".2s",
      }}
      onClick={handleClick}
    >
      {nodes?.map((node) => (
        <HistogramAvatar
          key={node.opinion.id}
          node={node}
          onClick={() => handleShowOpinion(node.opinion.user.id)}
        />
      ))}
    </div>
  );
};
