import { FC, useMemo } from "react";
import { Tooltip, Typography } from "@mui/material";
import { get } from "lodash-es";

import { Avatar } from "modules/users/components/Avatar";
import styles from "./HistogramAvatar.module.css";

export const HistogramAvatar: FC = ({
  node: { opinion, radius, x, y },
  onClick = () => {},
}) => {
  const { acceptance } = opinion || {};
  const acceptanceText = useMemo(() => {
    if (acceptance <= 0.05 && acceptance >= -0.05) {
      return "is neutral";
    } else {
      return `${acceptance > 0.05 ? "agrees" : "disagrees"} ${(
        Math.abs(acceptance) * 100
      ).toFixed(2)}%`;
    }
  }, [acceptance]);

  const user = get(opinion, "user", {});

  return (
    <Tooltip
      title={
        <Typography variant="body1">
          <b>{user.username}</b> {acceptanceText}
        </Typography>
      }
      placement="right"
    >
      <Avatar
        src={`${user.avatar}?s=${Math.ceil(radius * 2)}`}
        onClick={onClick}
        size={radius * 2}
        className={styles.avatar}
        sx={{
          position: "absolute",
          left: x,
          bottom: y,
        }}
      />
    </Tooltip>
  );
};
