import { useState } from "react";
import { Paper, Stack, Typography } from "@mui/material";

import { Avatar } from "modules/users/components/Avatar";
import { formatDate } from "common/utils/format";
import styles from "./Argument.module.css";
import { ArgumentSides } from "modules/claims/interfaces";
// import ArgumentDetails from "./ArgumentDetails";

export const Argument: FC = ({ argument, isOpining, hideReferrers }) => {
  // state = {
  //   showDetails: false,
  // };

  const [showDetails, setShowDetails] = useState(false);

  // const commentsCount = filter({ active: true }, comments).length;
  const handleDragStart = (event) => {
    event.dataTransfer.setData("argument", JSON.stringify(argument));
  };

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
        sx={{ p: 1 }}
        onDragStart={handleDragStart}
        draggable={isOpining}
      >
        <Stack spacing={1} sx={{ width: 312 }}>
          <Typography variant="body2">{argument?.summary}</Typography>
          <Typography variant="caption">
            {formatDate(argument?.createdAt)}, 3 comments
          </Typography>
        </Stack>
      </Paper>

      {hideReferrers ? null : (
        <div className={styles.argument__referrers}>
          {argument?.referrers?.map((referrer, i) => (
            <Avatar
              key={referrer.id}
              src={referrer.avatar}
              size={30}
              sx={{
                position: "absolute",
                [argument.side === ArgumentSides.CON ? "right" : "left"]:
                  (Math.floor(i / 10) * 30 + i) % (10 * 1),
                top: (i % 10) * 4,
                zIndex: 300 - i,
              }}
              title={referrer.username}
            />
          ))}
        </div>
      )}
    </div>
  );
};
