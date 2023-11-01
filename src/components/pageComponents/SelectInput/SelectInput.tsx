import { FC, ReactElement } from "react";
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

// note: don't use any any paddings/margins in this component,
// better add a wrapper like <Box mt={3} mb={1}><SelectInputField/></Box> instead.

const useSelectInputStyles = createStyleHook((theme) => {
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
        color: theme.palette.primary.contrastText,
        left: "7px",
        right: "unset",
      },
      "& .MuiSelect-select": {
        paddingLeft: "32px",
        paddingRight: "14px !important",
      },
      "& legend": {
        textAlign: "right",
        fontSize: "0.6rem",
      },
    },
    select: {
      borderColor: alpha(theme.palette.primary.main, 0.6),
      color: "#FFFFFF",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: alpha(theme.palette.primary.main, 0.6),
      },
    },
  };
});

interface SelectInputProps extends SelectProps {
  options: { [key: string]: string };
  label: string;
}

export const SelectInputField: FC<SelectInputProps> = (props) => {
  const styles = useSelectInputStyles();

  const { options, label, ...selectProps } = props;

  const menuItems: Array<ReactElement> = Object.keys(options).map(
    (itemValue, index) => (
      <MenuItem key={`menu_${itemValue}-${index}`} value={itemValue} dir="rtl">
        {options[itemValue]}
      </MenuItem>
    )
  );

  return (
    <RTLWrapper withMaxWidth>
      <FormControl sx={styles.root}>
        <InputLabel>{label}</InputLabel>
        <Select {...selectProps} sx={styles.select}>
          {menuItems}
        </Select>
      </FormControl>
    </RTLWrapper>
  );
};
