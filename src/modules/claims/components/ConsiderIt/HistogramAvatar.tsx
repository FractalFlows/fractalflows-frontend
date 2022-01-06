import { FC } from "react";
import { Tooltip, Typography } from "@mui/material";

import { Avatar } from "modules/users/components/Avatar";

export const HistogramAvatar: FC = ({ node, onClick = () => {} }) => {
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
        size={node.radius * 2}
        sx={{
          position: "absolute",
          left: node.x,
          bottom: node.y,
        }}
      />
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
