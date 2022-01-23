import * as React from "react";
import { alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import { LinearProgress } from "@mui/material";

import { useAuth } from "modules/auth/hooks/useAuth";
import { muiTheme } from "common/config/muiTheme";
import { Link } from "common/components/Link";
import { Search } from "./Search";
import styles from "./Header.module.css";
import { useApp } from "modules/app/useApp";
import { useRouter } from "next/router";
import { Container } from "@mui/material";

export const Header = () => {
  const { isChangingRoutes } = useApp();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const {
    signout,
    session: { user },
    isSignedIn,
  } = useAuth();

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
      sx={{
        maxWidth: "250px",
      }}
    >
      <MenuItem disabled sx={{ ...renderMenuOnlyOnMobile, fontWeight: 700 }}>
        <span className="text-overflow-ellipsis" title={user?.username}>
          {user?.username}
        </span>
      </MenuItem>
      <Link href={`/profile/${user?.username}`}>
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      </Link>
      <Link href="/settings/profile">
        <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
      </Link>
      <MenuItem
        onClick={() => {
          signout();
          handleMenuClose();
        }}
      >
        Sign out
      </MenuItem>
      <Box sx={{ ...renderMenuOnlyOnMobile }}>
        <Divider sx={{ my: 0.5 }} />
        <Link href="/claim/new">
          <MenuItem>Host new claim</MenuItem>
        </Link>
        {/* <MenuItem>Become a validator</MenuItem> */}
      </Box>
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
      <Link href="/claim/new">
        <MenuItem>Host new claim</MenuItem>
      </Link>
      {/* <MenuItem>Become a validator</MenuItem> */}
      {isSignedIn
        ? null
        : [
            <Divider key={0} sx={{ my: 0.5 }} />,
            <Link href="/signin" key={1}>
              <MenuItem
                onClick={() => {
                  handleMobileMenuClose();
                }}
              >
                <Button variant="contained" color="primary" fullWidth>
                  Sign in
                </Button>
              </MenuItem>
            </Link>,
          ]}
    </Menu>
  );

  const userAvatar = (
    <Avatar
      src={user?.avatar}
      sx={{
        width: 35,
        height: 35,
        bgcolor: alpha(muiTheme.palette.common.white, 0.15),
      }}
    >
      <AccountCircle sx={{ fontSize: 35 }} />
    </Avatar>
  );

  return (
    <div className={styles.header}>
      <AppBar position="sticky">
        <Container fixed>
          <Toolbar disableGutters>
            <Link href="/">
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { xs: "none", sm: "block" }, fontWeight: 700 }}
              >
                Fractal Flows
              </Typography>
            </Link>
            <Search />
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Link href="/claim/new">
                  <Button variant="text" color="primaryContrast">
                    Host new claim
                  </Button>
                </Link>
                {/* <Button variant="text" color="primaryContrast">
                Become a validator
              </Button> */}
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
                            fontWeight: 600,
                            textTransform: "initial",
                            maxWidth: 150,
                          }}
                          title={user?.username}
                        >
                          {user?.username}
                        </Typography>
                      </Stack>
                    </Button>
                  </>
                ) : (
                  <Link href="/signin">
                    <Button variant="contained" color="primaryContrast">
                      Sign in
                    </Button>
                  </Link>
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
        </Container>
      </AppBar>

      <LinearProgress
        className={styles.header__spinner}
        sx={isChangingRoutes ? {} : { display: "none" }}
      />
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
};
