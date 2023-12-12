import { forwardRef } from "react";
import { Fade } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";

export const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Fade in ref={ref} timeout={300} {...props} />;
});
