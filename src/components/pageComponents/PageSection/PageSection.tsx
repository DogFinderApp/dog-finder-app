import { Box, Typography } from "@mui/material";
import { FC, ReactNode } from "react";
import { createStyleHook } from "../../../hooks/styleHooks";
import { PageDivider } from "../PageDivider/PageDivider";

interface PageSectionProps {
  title: string;
  children: ReactNode;
  hasDivider: boolean;
}

const usePageSectionStyles = createStyleHook((theme) => {
  return {
    section: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "80%",
    },
    sectionTitle: {
      color: theme.palette.text.primary,
      marginBottom: "16px",
    },
  };
});

export const PageSection: FC<PageSectionProps> = ({
  title,
  children,
  hasDivider,
}) => {
  const styles = usePageSectionStyles();
  return (
    <Box sx={styles.section}>
      {hasDivider && <PageDivider />}
      <Typography variant="h5" sx={styles.sectionTitle}>
        {title}
      </Typography>
      {children}
    </Box>
  );
};
