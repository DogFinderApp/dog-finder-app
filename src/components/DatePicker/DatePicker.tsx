import { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker as MaterialDatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useRTLTextFieldStyles } from "../pageComponents/RTLTextInput/RTLTextField";
import { createStyleHook } from "../../hooks/styleHooks";
import { RTLWrapper } from "../common/RTLWrapper";

interface DatePickerProps {
  label: string;
  date: Dayjs | null;
  handleDateChange: (newValue: Dayjs | null) => void;
  error: boolean;
  required?: boolean;
}

const DatePicker = ({
  label,
  date,
  handleDateChange,
  error,
  required,
}: DatePickerProps) => {
  const basicInputStyles = useRTLTextFieldStyles();

  const useDatePickerStyles = createStyleHook((theme) => ({
    root: {
      ...basicInputStyles.root,
      margin: "1rem 0 0.5rem",
      ".MuiIconButton-root": {
        color: error ? theme.palette.error.dark : theme.palette.primary.main,
      },
    },
  }));

  const styles = useDatePickerStyles();

  return (
    <RTLWrapper withMaxWidth>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MaterialDatePicker
          label={label}
          format="DD/MM/YYYY"
          value={date}
          sx={styles.root}
          onChange={handleDateChange}
          disableFuture
          closeOnSelect
          slotProps={{ textField: { error, required } }}
        />
      </LocalizationProvider>
    </RTLWrapper>
  );
};

export default DatePicker;
