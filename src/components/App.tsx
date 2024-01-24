import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Box, ThemeProvider } from "@mui/material";
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

  const authDomain = process.env.REACT_APP_AUTH0_DOMAIN || "unknown";
  const authClient = process.env.REACT_APP_AUTH0_CLIENT_ID || "unknonw";
  const auth0Audience = process.env.REACT_APP_AUTH0_AUDIENCE || "";

  return (
    <Auth0Provider
      domain={authDomain}
      clientId={authClient}
      // we don't specify the redirect_url here anymore because we need it to be dynamic
      authorizationParams={{ audience: auth0Audience, scope: "read:dogs" }}
    >
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
    </Auth0Provider>
  );
};
