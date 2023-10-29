import { useState, useCallback } from "react";
import { Dayjs } from "dayjs";

interface UseDateInput {
  isMandatoryInput: boolean;
}

export const useDateInput = ({ isMandatoryInput }: UseDateInput) => {
  const [dateInput, setDateInput] = useState<Dayjs | null>(null);
  const [isInputValid, setIsInputValid] = useState(true);

  const handleDateChange = useCallback((newValue: Dayjs | null) => {
    // Clear any previous errors
    setIsInputValid(true);
    // Update date
    setDateInput(newValue);
  }, []);

  const clearInput = useCallback(() => {
    setDateInput(null);
  }, []);

  const validateInput = useCallback(() => {
    const isValid = !isMandatoryInput || !!dateInput;
    setIsInputValid(isValid);

    return isValid;
  }, [isMandatoryInput, dateInput]);

  return {
    dateInput,
    handleDateChange,
    isInputValid,
    validateInput,
    clearInput,
  };
};
