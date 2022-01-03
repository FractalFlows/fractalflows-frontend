import {
  Typography,
  Box,
  Grid,
  Stack,
  Chip,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import type { NextPage } from "next";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  GroupAdd as InviteFriendsIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";

import type { TagProps } from "modules/tags/interfaces";
import { AvatarWithUsername } from "modules/users/components/AvatarWithUsername";
import { KnowledgeBitProps } from "modules/claims/interfaces";

export const ConsiderIt: NextPage<{
  knowledgeBits?: KnowledgeBitProps[];
}> = ({ knowledgeBits }) => {
  const claim = {};
  return (
    <Box>
      <Stack spacing={3}>
        <Typography variant="h4" component="h2">
          Social opinions
        </Typography>
        {/* <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
        >
          <Box sx={{ width: { xs: "100%", md: "47%" } }}>
            <Typography variant="h5" component="h3">
              Knowledgde Bits refuting
            </Typography>
          </Box>
          <Box sx={{ width: { xs: "100%", md: "47%" } }}>
            <Typography variant="h5" component="h3">
              Knowledgde Bits supporting
            </Typography>
          </Box>
        </Stack> */}
      </Stack>
    </Box>
  );
};
