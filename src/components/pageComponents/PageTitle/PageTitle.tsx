import { Box, Typography, useTheme } from "@mui/material";

export const PageTitle = ({ text }: { text: string }) => {
  const theme = useTheme();
  return (
    <Box marginBottom={"20px"}>
      <Typography
        variant="h3"
        color={theme.palette.text.primary}
        fontWeight={700}
        textAlign="right"
        fontSize={{ sm: "3rem", xs: "2.4rem" }}
      >
        {text}
      </Typography>
    </Box>
  );
};
