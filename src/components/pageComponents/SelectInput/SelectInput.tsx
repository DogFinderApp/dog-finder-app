import { ReactElement } from "react";
import {
  SelectProps,
  alpha,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { createStyleHook } from "../../../hooks/styleHooks";
import { RTLWrapper } from "../../common/RTLWrapper";

const useSelectInputStyles = createStyleHook(
  (theme, props: { error: boolean }) => {
    const inputColor = {
      color: props.error
        ? theme.palette.error.main
        : theme.palette.primary.contrastText,
    };

    return {
      root: {
        width: "100%",
        maxWidth: "500px",
        margin: "1rem 0 0.5rem",
        "& .MuiFormLabel-root": {
          left: "unset",
          right: "1.75rem",
          transformOrigin: "right",
          fontSize: "0.8rem",
        },
        "& .MuiSvgIcon-root": {
          color: inputColor,
          left: "7px",
          right: "unset",
        },
        "& .MuiSelect-select": {
          paddingLeft: "32px",
          paddingRight: "14px !important",
        },
        "& legend": { textAlign: "right", fontSize: "0.6rem" },
        "& .MuiInputLabel-root": { color: inputColor },
      },
      select: {
        borderColor: alpha(theme.palette.primary.main, 0.6),
        color: "#FFFFFF",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: alpha(theme.palette.primary.main, 0.6),
        },
      },
    };
  }
);
interface SelectInputProps extends SelectProps {
  options: { [key: string]: string };
  label: string;
  value: string;
  error?: boolean;
  notCentered?: boolean;
}

export const SelectInputField = ({
  options,
  label,
  value,
  error,
  notCentered,
  ...selectProps
}: SelectInputProps) => {
  const styles = useSelectInputStyles({ error: !!error });

  const menuItems: Array<ReactElement> = Object.keys(options).map(
    (itemValue, index) => (
      <MenuItem key={`menu_${itemValue}-${index}`} value={itemValue} dir="rtl">
        {options[itemValue]}
      </MenuItem>
    )
  );

  return (
    <RTLWrapper withMaxWidth notCentered={notCentered}>
      <FormControl sx={styles.root}>
        <InputLabel>{label}</InputLabel>
        <Select
          {...selectProps}
          sx={styles.select}
          value={value}
          error={error}
          label={label}
        >
          {menuItems}
        </Select>
      </FormControl>
    </RTLWrapper>
  );
};
