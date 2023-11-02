import { Box, Typography, useTheme } from "@mui/material";

export const PageTitle = ({ text }: { text: string }) => {
  const theme = useTheme();
  return (
    <Box marginY={"20px"} position="relative" zIndex={10}>
      <Typography
        variant="h3"
        color={theme.palette.text.primary}
        fontWeight={700}
        textAlign="center"
      >
        {text}
      </Typography>
    </Box>
  );
};
