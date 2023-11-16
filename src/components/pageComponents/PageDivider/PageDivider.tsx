import { Box, alpha } from "@mui/material";
import { FC } from "react";
import { createStyleHook } from "../../../hooks/styleHooks";
import { AppShadows } from "../../../consts/shadows";

const usePageDividerStyles = createStyleHook((theme) => {
  return {
    divider: {
      width: "100%",
      maxWidth: "60%",
      height: "1px",
      margin: "20px 0",
      backgroundColor: alpha(theme.palette.divider, 0.1),
      boxShadow: AppShadows.sectionShadow,
    },
  };
});

export const PageDivider = () => {
  const styles = usePageDividerStyles();
  return <Box sx={styles.divider} />;
};
