import { Box, ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createStyleHook } from "../hooks/styleHooks";
import { HamalContextProvider } from "../context/HamalContext";
import { theme } from "../theme/theme";
import { routesWithElements } from "../consts/RoutesWithElements";
import { PageToolbar } from "./pageComponents/PageToolbar/PageToolbar";

const useAppStyles = createStyleHook(() => ({
  root: {
    width: "100%",
    minHeight: "100vh",
    overflowX: "hidden",
    backgroundColor: theme.palette.background.default,
  },
}));

export const App = () => {
  const styles = useAppStyles();

  return (
    <HamalContextProvider>
      <ThemeProvider theme={theme}>
        <Box sx={styles.root}>
          <BrowserRouter>
            <PageToolbar />
            <Routes>
              {routesWithElements.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<route.element {...route.props} />}
                />
              ))}
            </Routes>
          </BrowserRouter>
        </Box>
      </ThemeProvider>
    </HamalContextProvider>
  );
};
