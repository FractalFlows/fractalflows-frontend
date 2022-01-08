import { DragEvent, FC, MouseEvent, useRef, useState } from "react";
import { Button, Paper, Popover, Stack, Typography } from "@mui/material";

import { Avatar } from "modules/users/components/Avatar";
import { formatDate } from "common/utils/format";
import styles from "./Argument.module.css";
import { ArgumentProps, ArgumentSides } from "modules/claims/interfaces";
import { useOpinions } from "modules/claims/hooks/useOpinions";
import { map, get } from "lodash-es";
import { ArgumentDetails } from "./ArgumentDetails";
// import ArgumentDetails from "./ArgumentDetails";

export enum ArgumentPlacements {
  OPINION,
  RANKING,
}

interface ArgumentCompProps {
  argument: ArgumentProps;
  placement: ArgumentPlacements;
}

export const Argument: FC<ArgumentCompProps> = ({ argument, placement }) => {
  const { isOpining, removeArgumentFromOpinion } = useOpinions();
  const [showDetails, setShowDetails] = useState(false);
  const detailsAnchor = useRef(null);

  const handleDragStart = (event: DragEvent) => {
    event.dataTransfer.setData("argument", JSON.stringify(argument));
  };
  const handleRemoveClick = (event: MouseEvent) => {
    event.preventDefault();
    removeArgumentFromOpinion(argument.id);
  };
  const handleShowDetails = () => {
    setShowDetails(true);
  };
  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const commentsCount = get(argument, "comments.length", 0);

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
        ref={detailsAnchor}
        onClick={handleShowDetails}
        sx={{ p: 1, cursor: "pointer" }}
        {...(placement === ArgumentPlacements.OPINION
          ? {}
          : {
              onDragStart: handleDragStart,
              draggable: isOpining,
            })}
      >
        <Stack>
          <Typography variant="body1">{argument?.summary}</Typography>
          <Stack direction="row" alignItems="center" sx={{ minHeight: "31px" }}>
            <Typography variant="caption">
              {formatDate(get(argument, "createdAt"))}, {commentsCount} comment
              {commentsCount === 1 ? "" : "s"}
            </Typography>
            <div style={{ flexGrow: 1 }} />
            {placement === ArgumentPlacements.OPINION ? (
              <Button size="small" onClick={handleRemoveClick}>
                Remove
              </Button>
            ) : null}
          </Stack>
        </Stack>
      </Paper>

      <Popover
        open={showDetails}
        anchorEl={detailsAnchor.current}
        onClose={handleCloseDetails}
        anchorOrigin={{
          vertical: "bottom",
          horizontal:
            get(argument, "side") === ArgumentSides.CON ? "left" : "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal:
            get(argument, "side") === ArgumentSides.CON ? "left" : "right",
        }}
        PaperProps={{
          elevation: 1,
          sx: {
            width: "600px",
            border: "1px solid rgba(0, 0, 0, 0.12)",
            maxHeight: "70vh",
          },
        }}
        disableScrollLock
      >
        <ArgumentDetails argumentId={get(argument, "id")} />
      </Popover>

      {placement === ArgumentPlacements.OPINION ? null : (
        <div className={styles.argument__referrers}>
          {map(argument?.opinions, ({ user }, i) => (
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
