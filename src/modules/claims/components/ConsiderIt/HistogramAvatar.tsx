import { FC } from "react";
import { Avatar, Tooltip, Typography } from "@mui/material";

import AccountCircle from "@mui/icons-material/AccountCircle";

export const HistogramAvatar: FC = ({ node, onClick = () => {} }) => {
  const size = node.radius * 2;

  return (
    <Tooltip
      title={
        <Typography variant="body1">
          <b>{node.opinion.user.username}</b> disagrees 80%
        </Typography>
      }
      placement="right"
    >
      <Avatar
        src={node.opinion.user.avatar}
        onClick={onClick}
        sx={{
          position: "absolute",
          left: node.x,
          bottom: node.y,
          width: size,
          height: size,
        }}
      >
        <AccountCircle sx={{ fontSize: size }} />
      </Avatar>
    </Tooltip>
  );
};

// _value = () => {
//   const { acceptance } = this.props.opinion;

//   if (acceptance <= 0.05 && acceptance >= -0.05) {
//     return "Neutral";
//   }
//   return `${(Math.abs(acceptance) * 100).toFixed(2)}%`;
// };

// _valence = () => {
//   const { acceptance } = this.props.opinion;

//   if (acceptance > 0.05) {
//     return "Agree";
//   } else if (acceptance < -0.05) {
//     return "Disagree";
//   }
// };
