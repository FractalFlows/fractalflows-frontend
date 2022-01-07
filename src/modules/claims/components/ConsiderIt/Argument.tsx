import { useState } from "react";
import { Paper, Stack, Typography } from "@mui/material";

import { Avatar } from "modules/users/components/Avatar";
import { formatDate } from "common/utils/format";
import styles from "./Argument.module.css";
import { ArgumentProps, ArgumentSides } from "modules/claims/interfaces";
import { useOpinions } from "modules/claims/hooks/useOpinions";
// import ArgumentDetails from "./ArgumentDetails";

export enum ArgumentPlacements {
  PICKED,
  ALL,
}

interface ArgumentCompProps {
  argument: ArgumentProps;
  placement: ArgumentPlacements;
}

export const Argument: FC<ArgumentCompProps> = ({ argument, placement }) => {
  // state = {
  //   showDetails: false,
  // };
  const { isOpining } = useOpinions();
  const [showDetails, setShowDetails] = useState(false);

  // const commentsCount = filter({ active: true }, comments).length;
  const handleDragStart = (event) => {
    event.dataTransfer.setData("argument", JSON.stringify(argument));
  };

  const commentsCount = argument?.comments?.length || 0;

  return (
    <div
      className={`${styles.argument} ${
        styles[
          `argument--${argument.side === ArgumentSides.CON ? "cons" : "pros"}`
        ]
      }`}
    >
      <Paper
        variant="outlined"
        sx={{ p: 1, cursor: "pointer" }}
        onDragStart={handleDragStart}
        draggable={isOpining}
      >
        <Stack spacing={1}>
          <Typography variant="body2">{argument?.summary}</Typography>
          <Typography variant="caption">
            {formatDate(argument?.createdAt)}, {commentsCount} comment
            {commentsCount === 1 ? "" : "s"}
          </Typography>
        </Stack>
      </Paper>

      {placement === ArgumentPlacements.PICKED ? null : (
        <div className={styles.argument__referrers}>
          {argument?.opinions?.map(({ user }, i) => (
            <Avatar
              key={user.username}
              src={user.avatar}
              size={30}
              sx={{
                position: "absolute",
                [argument.side === ArgumentSides.CON ? "right" : "left"]:
                  (Math.floor(i / 10) * 30 + i) % (10 * 1),
                top: (i % 10) * 4,
                zIndex: 300 - i,
              }}
              title={user.username}
            />
          ))}
        </div>
      )}
    </div>
  );
};
