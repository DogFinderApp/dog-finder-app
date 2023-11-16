import { createTheme } from "@mui/material";
import { AppColors } from "../consts/colors";

const {
  palette: { augmentColor },
} = createTheme();

const createColor = (mainColor: string) =>
  augmentColor({ color: { main: mainColor } });
const createBackgroundColor = (color: string, paper: string) => ({
  default: color,
  paper,
});
const createTextColor = (color: string) => ({
  primary: color,
  secondary: color,
  disabled: color,
});

const palette = {
  primary: createColor(AppColors.primary),
  secondary: createColor(AppColors.secondary),
  background: createBackgroundColor(AppColors.background, AppColors.paper),
  divider: AppColors.divider,
  text: createTextColor(AppColors.text),
  action: {
    disabledBackground: "#878f99",
    disabled: "white",
  },
};

export const theme = createTheme({
  direction: "rtl",
  palette,
});
