import { Box, BoxProps } from "@mui/material";
import { FC } from "react";

interface PageImageProps extends BoxProps {
  alt: string;
  src: string;
}

export const PageImage: FC<PageImageProps> = (props) => {
  return <Box {...props} component="img" />;
};
