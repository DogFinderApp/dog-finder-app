import { Box, CircularProgress, Theme, Typography } from "@mui/material";
import { createStyleHook } from "../../hooks/styleHooks";

interface StylesProps {
  fontSize?: number;
  marginTop?: string | number;
}

const useLoadingStyles = createStyleHook(
  (theme: Theme, { fontSize, marginTop }: StylesProps) => {
    return {
      loadingContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        textWrap: "balance",
        mt: marginTop ?? 0,
      },
      loadingText: {
        color: "white",
        textAlign: "center",
        fontSize: fontSize ?? 26,
      },
    };
  },
);

interface LoadingProps {
  title: string;
  fontSize?: number;
  marginTop?: string | number;
}

export const LoadingSpinnerWithText = ({
  title,
  fontSize,
  marginTop,
}: LoadingProps) => {
  const styles = useLoadingStyles({ fontSize, marginTop });
  return (
    <Box sx={styles.loadingContainer}>
      <Typography sx={styles.loadingText}>{title}</Typography>
      <CircularProgress size={60} sx={{ my: 2 }} />
    </Box>
  );
};
