import { useEffect, useState } from "react";
import {
  Box,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { IconGridDots, IconPaw } from "@tabler/icons-react";
import { createStyleHook } from "../../../hooks/styleHooks";
import { useGetServerApi } from "../../../facades/ServerApi";
import UserComponent from "../UserComponent/UserComponent";
import { AppRoutes } from "../../../consts/routes";
import { AppShadows } from "../../../consts/shadows";
import { links, hamalLinks } from "./links";

const usePageToolbarStyles = createStyleHook((theme) => ({
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
    zIndex: 20,
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
    direction: "rtl",
    minHeight: "unset",
    display: "flex",
    gap: 2,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.palette.background.paper,
    "&:hover, &.Mui-focusVisible": {
      backgroundColor: theme.palette.primary.light,
    },
  },
  chip: { fontSize: 12, height: "25px" },
  divider: { my: "4px", opacity: 0.3 },
}));

export const PageToolbar = () => {
  const styles = usePageToolbarStyles();
  const theme = useTheme();
  const getServerApi = useGetServerApi();
  const { isAuthenticated } = useAuth0();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isHamalUser, setIsHamalUser] = useState<boolean | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const checkUserRole = async () => {
      const serverApi = await getServerApi();
      setIsHamalUser(serverApi.isHamalUser());
    };

    if (isAuthenticated && isHamalUser === null) {
      checkUserRole();
    }
  }, [isAuthenticated, isHamalUser, getServerApi]);

  const linksToRender = isHamalUser ? [...links, ...hamalLinks] : links;

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
        {linksToRender.map((link, index) => (
          <>
            <Link
              key={link.text}
              to={link.href}
              style={{ color: "white", textDecoration: "none" }}
              onClick={handleCloseMenu}
            >
              <MenuItem sx={styles.menuItem}>
                {link.text}
                {index > 4 && (
                  <Chip label={'חמ"ל'} color="primary" sx={styles.chip} />
                )}
              </MenuItem>
            </Link>
            {index === 4 && isHamalUser && (
              <Divider variant="middle" sx={styles.divider} />
            )}
          </>
        ))}
      </Menu>
    </Box>
  );
};
