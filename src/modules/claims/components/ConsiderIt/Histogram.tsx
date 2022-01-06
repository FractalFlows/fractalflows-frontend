import React, { Component, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { isEqual, map, cloneDeep } from "lodash-es";

import { HistogramAvatar } from "./HistogramAvatar";
import { positionAvatars } from "./helpers";

export const Histogram: FC<{}> = ({
  opinions,
  isOpining,
  setIsOpining,
  showOpinionFrom,
}) => {
  const histogram = useRef(null);
  const [nodes, setNodes] = useState([]);

  const handleClick = () => setIsOpining(false);

  useEffect(() => {
    console.log(histogram);
    if (histogram.current) {
      const nodes = positionAvatars(
        opinions,
        histogram.current.offsetWidth,
        histogram.current.offsetHeight
      );
      setNodes(nodes);
    }
  }, [opinions, histogram]);
  console.log(nodes);

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
          onClick={() => showOpinionFrom(node.opinion.user.id)}
        />
      ))}
    </div>
  );
};

// Histogram.defaultProps = {
//   showOpinionFrom: PropTypes.func,
// };

// Histogram.propTypes = {
//   opinions: PropTypes.array.isRequired,
//   width: PropTypes.number.isRequired,
//   height: PropTypes.number.isRequired,
//   givingOpinion: PropTypes.bool.isRequired,
//   showOpinionFrom: PropTypes.func,
//   setGivingOpinionAs: PropTypes.func.isRequired,
// };
