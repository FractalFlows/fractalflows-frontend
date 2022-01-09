import { forwardRef } from "react";
import { Avatar as MuiAvatar } from "@mui/material";

import AccountCircle from "@mui/icons-material/AccountCircle";

export const Avatar = forwardRef(({ src, size, sx, ...props }, ref) => (
  <MuiAvatar
    src={src}
    ref={ref}
    sx={{
      width: size,
      height: size,
      ...sx,
    }}
    {...props}
  >
    <AccountCircle sx={{ fontSize: size }} />
  </MuiAvatar>
));
