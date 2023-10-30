import { Box, Fade } from "@mui/material";
import React, { FC, ReactNode } from "react";
import { createStyleHook } from "../../../hooks/styleHooks";
import { PageToolbar } from "../PageToolbar/PageToolbar";

interface IPageContainerProps {
  children: ReactNode;
}

const usePageContainerStyles = createStyleHook((theme) => {
  return {
    root: {
      width: "100%",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    content: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      marginTop: "80px",
    },
  };
});

export const PageContainer: FC<IPageContainerProps> = ({ children }) => {
  const styles = usePageContainerStyles();

  return (
    <Box sx={styles.root}>
      <PageToolbar />
      <Fade in timeout={350}>
        <Box sx={styles.content}>{children}</Box>
      </Fade>
    </Box>
  );
};
