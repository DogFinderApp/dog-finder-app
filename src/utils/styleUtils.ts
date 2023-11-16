import { SxProps, Theme } from "@mui/material";

export function combineStyles(...styles: Array<SxProps<Theme>>) {
  return styles.reduce((res, curr) => ({ ...res, ...curr }), {});
}
