import { useCallback, useState } from "react";
import validator from "validator";

// TODO: make this DRYER. @galzo don't kill me. we're at war
export const usePhoneNumberInput = (props: { isMandatoryInput: boolean }) => {
  const [phoneInput, setPhoneInput] = useState("");
  const [isInputValid, setIsInputValid] = useState(true);

  const clearInput = useCallback(() => {
    setPhoneInput("");
  }, []);

  const handlePhoneChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: any) => {
      // Clear any previous errors
      setIsInputValid(true);

      // Update phone number
      const newPhone = event.target.value as string;
      setPhoneInput(newPhone.trim());
    },
    [],
  );

  const validateInput = useCallback(() => {
    const isValid =
      (!props.isMandatoryInput && !phoneInput) ||
      (Boolean(phoneInput) && validator.isMobilePhone(phoneInput, "he-IL"));
    setIsInputValid(isValid);

    return isValid;
  }, [props.isMandatoryInput, phoneInput]);

  return {
    value: phoneInput,
    onPhoneChange: handlePhoneChange,
    isPhoneValid: isInputValid,
    validateInput,
    clearInput,
  };
};
