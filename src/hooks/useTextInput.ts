import { useCallback, useState } from "react";

// TODO: can we make an interface out of these hooks?
export const useTextInput = (props: { isMandatoryInput: boolean }) => {
  const [textInput, setTextInput] = useState("");
  const [isInputValid, setIsInputValid] = useState(true);

  const handleTextChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: any) => {
      // Clear any previous errors
      setIsInputValid(true);

      // Update text
      const newText = event.target.value as string;
      setTextInput(newText);
    },
    [],
  );

  const clearInput = useCallback(() => {
    setTextInput("");
  }, []);

  const validateInput = useCallback(() => {
    const isValid =
      !props.isMandatoryInput || (Boolean(textInput) && textInput.length > 0);
    setIsInputValid(isValid);

    return isValid;
  }, [props.isMandatoryInput, textInput]);

  return {
    value: textInput,
    onTextChange: handleTextChange,
    isTextValid: isInputValid,
    validateInput,
    clearInput,
  };
};
