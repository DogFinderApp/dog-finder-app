import { useCallback, useState } from "react";

// TODO: make this DRYER. @galzo don't kill me. we're at war
export const useSelectInput = (props: {
  isMandatoryInput: boolean;
  possibleValues: Array<any>;
}) => {
  const [valueInput, setValueInput] = useState("");
  const [isInputValid, setIsInputValid] = useState(true);

  const clearInput = useCallback(() => {
    setValueInput("");
  }, []);

  const handleValueChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: any) => {
      // Clear any previous errors
      setIsInputValid(true);

      // Update value
      const newValue = event.target.value as string;
      setValueInput(newValue);
    },
    [],
  );

  const validateInput = useCallback(() => {
    const isValid =
      (!props.isMandatoryInput && !valueInput) ||
      (Boolean(valueInput) && props.possibleValues.includes(valueInput));
    setIsInputValid(isValid);

    return isValid;
  }, [props.isMandatoryInput, valueInput]);

  return {
    value: valueInput,
    onSelectChange: handleValueChange,
    isValueValid: isInputValid,
    validateInput,
    clearInput,
  };
};
