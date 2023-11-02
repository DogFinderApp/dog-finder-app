import { Box, Typography, useTheme } from "@mui/material";
import { RTLWrapper } from "../../common/RTLWrapper";

export const PageTitle = ({ text }: { text: string }) => {
  const theme = useTheme();
  return (
    <Box marginY={"20px"} position="relative" zIndex={10}>
      <RTLWrapper>
        <Typography
          variant="h3"
          color={theme.palette.text.primary}
          fontWeight={700}
          textAlign="center"
        >
          {text}
        </Typography>
      </RTLWrapper>
    </Box>
  );
};
