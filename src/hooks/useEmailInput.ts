import { useCallback, useState } from "react";
import validator from "validator";

// TODO: make this DRYER. @galzo don't kill me. we're at war
export const useEmailInput = (props: { isMandatoryInput: boolean }) => {
  const [emailInput, setEmailInput] = useState("");
  const [isInputValid, setIsInputValid] = useState(true);

  const clearInput = useCallback(() => {
    setEmailInput("");
  }, []);

  const handleEmailChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: any) => {
      // Clear any previous errors
      setIsInputValid(true);

      // Update email
      const newEmail = event.target.value as string;
      setEmailInput(newEmail.trim());
    },
    [],
  );

  const validateInput = useCallback(() => {
    const isValid =
      (!props.isMandatoryInput && !emailInput) ||
      (Boolean(emailInput) && validator.isEmail(emailInput));
    setIsInputValid(isValid);

    return isValid;
  }, [props.isMandatoryInput, emailInput]);

  return {
    value: emailInput,
    onEmailChange: handleEmailChange,
    isEmailValid: isInputValid,
    validateInput,
    clearInput,
  };
};
