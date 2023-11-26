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
import { useAuthContext } from "../../../context/useAuthContext";
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

const linkStyles = { color: "white", textDecoration: "none" };

export const PageToolbar = () => {
  const styles = usePageToolbarStyles();
  const theme = useTheme();
  const getServerApi = useGetServerApi();
  const { isAuthenticated } = useAuth0();
  const {
    dispatch,
    state: { isHamalUser },
  } = useAuthContext();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setIsMenuOpen(false);
    window.scroll({ top: 0 });
  };

  useEffect(() => {
    const getUserRoleAndReports = async () => {
      const serverApi = await getServerApi();
      dispatch({ type: "SET_IS_HAMAL_USER", payload: serverApi.isHamalUser() });
      try {
        const response = await serverApi.getUserReportedDogs();
        if (!response?.ok) return;
        const json = await response.json();
        if (json?.data?.results?.length) {
          dispatch({ type: "SET_USER_REPORTS", payload: json.data.results });
        }
      } catch (error) {
        console.error(error); // eslint-disable-line
      }
    };

    if (isAuthenticated) {
      getUserRoleAndReports();
    }
  }, [isAuthenticated, getServerApi, dispatch]);

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
          <Link
            key={link.text}
            to={link.href}
            style={linkStyles}
            onClick={handleCloseMenu}
          >
            <MenuItem sx={styles.menuItem}>{link.text}</MenuItem>
          </Link>
        ))}
        {isHamalUser && (
          <>
            <Divider variant="middle" sx={styles.divider} />
            {hamalLinks.map((link) => (
              <Link
                key={link.text}
                to={link.href}
                style={linkStyles}
                onClick={handleCloseMenu}
              >
                <MenuItem sx={styles.menuItem}>
                  {link.text}
                  <Chip label={'חמ"ל'} color="primary" sx={styles.chip} />
                </MenuItem>
              </Link>
            ))}
          </>
        )}
      </Menu>
    </Box>
  );
};
