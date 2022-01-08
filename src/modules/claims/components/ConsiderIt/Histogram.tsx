import { FC, useEffect, useRef, useState } from "react";

import { HistogramAvatar } from "./HistogramAvatar";
import { positionAvatars } from "./helpers";
import { useOpinions } from "modules/claims/hooks/useOpinions";
import { NoResults } from "common/components/NoResults";
import { isEmpty, map } from "lodash-es";

export const Histogram: FC<{}> = () => {
  const { opinions, isOpining, setIsOpining, setShowOpinionId } = useOpinions();
  const histogram = useRef(null);
  const [nodes, setNodes] = useState([]);

  const handleClick = () => setIsOpining(false);
  const handleShowOpinion = (opinionId: string) => setShowOpinionId(opinionId);

  useEffect(() => {
    if (histogram.current) {
      const nodes = positionAvatars(
        [...opinions],
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={handleClick}
    >
      {isEmpty(nodes) ? (
        <NoResults p={0}>No opinions as of yet</NoResults>
      ) : (
        map(nodes, (node) => (
          <HistogramAvatar
            key={node.opinion.id}
            node={node}
            onClick={() => handleShowOpinion(node.opinion.id)}
          />
        ))
      )}
    </div>
  );
};
