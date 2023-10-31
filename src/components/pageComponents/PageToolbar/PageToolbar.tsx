import { useState } from "react";
import { Box, IconButton, Menu, MenuItem, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { IconGridDots, IconPaw } from "@tabler/icons-react";
import { createStyleHook } from "../../../hooks/styleHooks";
import UserComponent from "../UserComponent/UserComponent";
import { AppRoutes } from "../../../consts/routes";
import { AppShadows } from "../../../consts/shadows";
import { links } from "./links.";

const usePageToolbarStyles = createStyleHook((theme) => {
  return {
    root: {
      width: "100%",
      height: "70px",
      backgroundColor: theme.palette.background.paper,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: AppShadows.toolbarShadow,
      position: "fixed",
      zIndex: 10,
    },
    menuButton: {
      position: "absolute",
      left: 20,
      borderRadius: 0,
      "&:hover, &.Mui-focusVisible": {
        backgroundColor: theme.palette.primary.light,
      },
    },
    menuItem: {
      "&:hover, &.Mui-focusVisible": {
        backgroundColor: theme.palette.primary.light,
      },
      backgroundColor: theme.palette.background.paper,
    },
  };
});

export const PageToolbar = () => {
  const styles = usePageToolbarStyles();
  const theme = useTheme();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setIsMenuOpen(false);
  };

  return (
    <Box sx={styles.root}>
      <UserComponent />
      <Link to={AppRoutes.root}>
        <IconPaw
          color={theme.palette.primary.light}
          fill={theme.palette.primary.main}
          style={{ cursor: "pointer" }}
          stroke={0.5}
          size={60}
        />
      </Link>
      <IconButton onClick={handleOpenMenu} sx={styles.menuButton}>
        <IconGridDots strokeWidth={1.5} color={theme.palette.text.primary} />
      </IconButton>
      <Menu open={isMenuOpen} onClose={handleCloseMenu} anchorEl={anchorEl}>
        {links.map((link) => (
          <MenuItem key={link.href} sx={styles.menuItem}>
            <Link
              to={link.href}
              style={{ color: "white", textDecoration: "none" }}
            >
              {link.text}
            </Link>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
