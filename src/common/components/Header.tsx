import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";

import { useAuth } from "modules/auth/hooks/useAuth";
import { muiTheme } from "common/config/muiTheme";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const { signin, signout, session, isSignedIn } = useAuth();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenuOnlyOnMobile = { display: { xs: "block", sm: "none" } };
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem disabled sx={{ ...renderMenuOnlyOnMobile, fontWeight: 800 }}>
        {session.username}
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>My claims</MenuItem>
      <MenuItem
        onClick={() => {
          signout();
          handleMenuClose();
        }}
      >
        Sign out
      </MenuItem>
      <Divider sx={{ my: 0.5 }} />
      <MenuItem sx={{ ...renderMenuOnlyOnMobile }}>Host new claim</MenuItem>
      <MenuItem sx={{ ...renderMenuOnlyOnMobile }}>Become a validator</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>Host new claim</MenuItem>
      <MenuItem>Become a validator</MenuItem>
      {isSignedIn ? null : (
        <>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem>
            <Button
              variant="contained"
              color="primary"
              startIcon={<i className="fab fa-ethereum"></i>}
              onClick={() => {
                signin();
                handleMobileMenuClose();
              }}
            >
              Sign in with Ethereum
            </Button>
          </MenuItem>
        </>
      )}
    </Menu>
  );

  const userAvatar = session.avatar ? (
    <Avatar src={session.avatar} />
  ) : (
    <Avatar
      sx={{
        bgcolor: alpha(muiTheme.palette.common.white, 0.15),
      }}
    >
      <AccountCircle />
    </Avatar>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Fractal Flows
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search claims…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Stack direction="row" spacing={2}>
              <Button variant="text" color="primaryContrast">
                Host new claim
              </Button>
              <Button variant="text" color="primaryContrast">
                Become a validator
              </Button>
              {isSignedIn ? (
                <>
                  <Divider orientation="vertical" flexItem />
                  <Button
                    variant="text"
                    onClick={handleProfileMenuOpen}
                    color="primaryContrast"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      {userAvatar}
                      <Typography
                        variant="body1"
                        noWrap
                        sx={{
                          fontWeight: 800,
                          textTransform: "initial",
                          maxWidth: 150,
                        }}
                      >
                        {session.username}
                      </Typography>
                    </Stack>
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="primaryContrast"
                  startIcon={<i className="fab fa-ethereum"></i>}
                  onClick={signin}
                >
                  Sign in with Ethereum
                </Button>
              )}
            </Stack>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            {isSignedIn ? (
              <>
                <IconButton
                  onClick={handleProfileMenuOpen}
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                >
                  {userAvatar}
                </IconButton>
              </>
            ) : (
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
};
