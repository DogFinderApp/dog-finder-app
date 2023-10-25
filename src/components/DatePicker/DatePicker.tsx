import { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker as MaterialDatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useRTLTextFieldStyles } from "../pageComponents/RTLTextInput/RTLTextField";
import { createStyleHook } from "../../hooks/styleHooks";
import { DogType } from "../../facades/payload.types";
import { RTLWrapper } from "../common/RTLWrapper";
import { AppTexts } from "../../consts/texts";

interface DatePickerProps {
  reportType: DogType;
  date: Dayjs | null;
  handleDateChange: (newValue: Dayjs | null) => void;
}

const DatePicker = ({
  reportType,
  date,
  handleDateChange,
}: DatePickerProps) => {
  const basicInputStyles = useRTLTextFieldStyles();

  const useDatePickerStyles = createStyleHook((theme) => {
    return {
      root: {
        ...basicInputStyles.root,
        margin: "1rem 0 0.5rem",
        ".MuiIconButton-root": { color: theme.palette.primary.main },
      },
    };
  });

  const styles = useDatePickerStyles();

  const labels = {
    lost: AppTexts.reportPage.dateDetails.lostDate,
    found: AppTexts.reportPage.dateDetails.foundDate,
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <RTLWrapper>
        <MaterialDatePicker
          label={labels[reportType]}
          format="DD/MM/YYYY"
          value={date}
          sx={styles.root}
          onChange={handleDateChange}
          disableFuture
          closeOnSelect
        />
      </RTLWrapper>
    </LocalizationProvider>
  );
};

export default DatePicker;
