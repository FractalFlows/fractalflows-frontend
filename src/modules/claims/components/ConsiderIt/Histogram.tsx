import { FC, useEffect, useRef, useState } from "react";
import { sumBy, isEmpty, map } from "lodash-es";
import { Stack, Tooltip, Typography } from "@mui/material";

import { HistogramAvatar } from "./HistogramAvatar";
import { normalizeAcceptance, positionAvatars } from "./helpers";
import { useOpinions } from "modules/claims/hooks/useOpinions";
import { NoResults } from "common/components/NoResults";
import { OpinionProps } from "modules/claims/interfaces";
import styles from "./Histogram.module.css";
import { useMemo } from "react";

interface HistogramProps {
  opinions: OpinionProps[];
  height?: number;
  placement?: HistogramPlacement;
}

export enum HistogramPlacement {
  CLAIM_TILE,
  CONSIDER_IT,
}

export const Histogram: FC<HistogramProps> = ({
  opinions = [],
  height = 200,
  placement = HistogramPlacement.CONSIDER_IT,
}) => {
  const { isOpining, setIsOpining, setShowOpinionId } = useOpinions();
  const histogram = useRef(null);
  const [nodes, setNodes] = useState([]);
  const opinionsWithNormalizedAcceptance = useMemo(
    () => normalizeAcceptance(opinions),
    [opinions]
  );

  const handleClick = () => setIsOpining(false);
  const handleShowOpinion = (opinionId: string) => setShowOpinionId(opinionId);

  useEffect(() => {
    if (histogram.current) {
      const nodes = positionAvatars(
        [...(opinions || [])],
        histogram.current.offsetWidth,
        histogram.current.offsetHeight
      );
      setNodes(nodes);
    }
  }, [opinions, histogram]);

  return (
    <div>
      <div
        ref={histogram}
        className={`${styles.histogram} ${
          isOpining ? styles["histogram--blurred"] : ""
        } ${
          placement === HistogramPlacement.CLAIM_TILE
            ? styles["histogram--claim-tile"]
            : ""
        }`}
        style={{
          height,
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
      {placement === HistogramPlacement.CLAIM_TILE ? (
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
          <Typography variant="body2">Disagree</Typography>
          <Tooltip
            title={`${opinionsWithNormalizedAcceptance.length} opinion${
              opinionsWithNormalizedAcceptance.length === 1 ? "" : "s"
            }. Average of ${(opinionsWithNormalizedAcceptance.length === 0
              ? 0
              : sumBy(opinionsWithNormalizedAcceptance, "acceptance") /
                opinions.length
            ).toFixed(2)} on -1 to 1 scale`}
          >
            <Typography variant="body2">
              {sumBy(opinionsWithNormalizedAcceptance, "acceptance").toFixed(2)}
            </Typography>
          </Tooltip>
          <Typography variant="body2">Agree</Typography>
        </Stack>
      ) : null}
    </div>
  );
};
