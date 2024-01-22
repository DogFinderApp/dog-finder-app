import { Box, ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createStyleHook } from "../hooks/styleHooks";
import { AuthContextProvider } from "../context/AuthContext";
import { theme } from "../theme/theme";
import { routesWithElements } from "../consts/RoutesWithElements";
import { PageToolbar } from "./pageComponents/PageToolbar/PageToolbar";
import { Footer } from "./pageComponents/Footer/Footer";

const useAppStyles = createStyleHook(() => ({
  root: {
    width: "100%",
    minHeight: "100vh",
    overflow: "hidden",
    backgroundColor: theme.palette.background.default,
  },
}));

export const App = () => {
  const styles = useAppStyles();

  return (
    <AuthContextProvider>
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
            <Footer />
          </BrowserRouter>
        </Box>
      </ThemeProvider>
    </AuthContextProvider>
  );
};
