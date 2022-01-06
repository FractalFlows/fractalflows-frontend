import { useState } from "react";
import { Paper, Stack, Typography } from "@mui/material";

import { Avatar } from "modules/users/components/Avatar";
import { formatDate } from "common/utils/format";
import styles from "./Argument.module.css";
import { ArgumentTypes } from "modules/claims/interfaces";
// import ArgumentDetails from "./ArgumentDetails";

export const Argument: FC = ({ argument }) => {
  // state = {
  //   showDetails: false,
  // };

  const { summary, createdAt, comments } = argument;
  const [showDetails, setShowDetails] = useState(false);

  // const commentsCount = filter({ active: true }, comments).length;

  return (
    <div
      className={`${styles.argument} ${
        styles[
          `argument--${argument.type === ArgumentTypes.CON ? "cons" : "pros"}`
        ]
      }`}
    >
      <Paper variant="outlined" sx={{ p: 1 }}>
        <Stack spacing={1} sx={{ width: 300 }}>
          <Typography variant="body2">{argument?.summary}</Typography>
          <Typography variant="caption">
            {formatDate(argument?.createdAt)}, 3 comments
          </Typography>
        </Stack>
      </Paper>

      <div
        className={styles.argument__referrers}
        // side={type === "con" ? "right" : "left"}
      >
        {argument?.referrers?.map((referrer, i) => (
          <Avatar
            key={referrer.id}
            src={referrer.avatar}
            size={30}
            sx={{
              position: "absolute",
              [argument.type === ArgumentTypes.CON ? "right" : "left"]:
                (Math.floor(i / 10) * 30 + i) % (10 * 1),
              top: (i % 10) * 4,
              zIndex: 300 - i,
            }}
            title={referrer.username}
          />
        ))}
      </div>
    </div>
  );
};
