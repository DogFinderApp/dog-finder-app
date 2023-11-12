import { TextField, TextFieldProps, alpha } from "@mui/material";
import { createStyleHook } from "../../../hooks/styleHooks";
import { RTLWrapper } from "../../common/RTLWrapper";

export const useRTLTextFieldStyles = createStyleHook((theme) => {
  return {
    root: {
      width: "100%",
      maxWidth: "500px",
      marginBottom: "8px",
      "& label": {
        left: "unset",
        right: "1.75rem",
        transformOrigin: "right",
        fontSize: "0.8rem",
      },
      "& legend": {
        textAlign: "right",
        fontSize: "0.6rem",
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: alpha(theme.palette.primary.main, 0.6),
        },
        "&:hover fieldset": {
          borderColor: alpha(theme.palette.primary.main, 0.6),
        },
      },
      "& .MuiFormHelperText-root": { textAlign: "right" },
    },
  };
});

type RTLTextFieldProps = {
  helperText?: string;
} & TextFieldProps;

export const RTLTextField = (props: RTLTextFieldProps) => {
  const styles = useRTLTextFieldStyles();
  return (
    <RTLWrapper withMaxWidth>
      <TextField {...props} sx={styles.root} helperText={props.helperText} />
    </RTLWrapper>
  );
};
