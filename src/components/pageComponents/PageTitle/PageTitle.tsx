import { Box, Typography, useTheme } from "@mui/material";
import { RTLWrapper } from "../../common/RTLWrapper";

interface PageTitleProps {
  text: string;
  fontSize?: string | number | Record<string, string | number>;
}

export const PageTitle = ({ text, fontSize }: PageTitleProps) => {
  const theme = useTheme();
  return (
    <Box marginY={"20px"} position="relative" zIndex={10}>
      <RTLWrapper>
        <Typography
          variant="h3"
          color={theme.palette.text.primary}
          fontWeight={700}
          textAlign="center"
          fontSize={fontSize}
        >
          {text}
        </Typography>
      </RTLWrapper>
    </Box>
  );
};
