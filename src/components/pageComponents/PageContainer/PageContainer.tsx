import { FC, ReactNode } from "react";
import { Box, Fade } from "@mui/material";
import { createStyleHook } from "../../../hooks/styleHooks";

interface IPageContainerProps {
  children: ReactNode;
}

const usePageContainerStyles = createStyleHook(() => ({
  root: {
    width: "100%",
    height: "100%",
    minHeight: "95vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  content: {
    width: { sm: "100%", xs: "90%" },
    height: "100%",
    display: "flex",
    flexDirection: "column",
    marginTop: "80px",
  },
}));

export const PageContainer: FC<IPageContainerProps> = ({ children }) => {
  const styles = usePageContainerStyles();

  return (
    <Box sx={styles.root}>
      <Fade in timeout={350}>
        <Box sx={styles.content}>{children}</Box>
      </Fade>
    </Box>
  );
};
