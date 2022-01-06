import { Avatar as MuiAvatar } from "@mui/material";

import AccountCircle from "@mui/icons-material/AccountCircle";

export const Avatar = ({ src, size, sx, ...props }) => (
  <MuiAvatar
    src={src}
    sx={{
      width: size,
      height: size,
      ...sx,
    }}
    {...props}
  >
    <AccountCircle sx={{ fontSize: size }} />
  </MuiAvatar>
);
