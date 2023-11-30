import { useCallback, useState } from "react";

interface UseSelectInput {
  isMandatoryInput: boolean;
  possibleValues: Array<any>;
}
export const useSelectInput = ({
  isMandatoryInput,
  possibleValues,
}: UseSelectInput) => {
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
      (!isMandatoryInput && !valueInput) ||
      (Boolean(valueInput) && possibleValues.includes(valueInput));
    setIsInputValid(isValid);

    return isValid;
  }, [isMandatoryInput, valueInput, possibleValues]);

  return {
    value: valueInput,
    onSelectChange: handleValueChange,
    isValueValid: isInputValid,
    validateInput,
    clearInput,
    isRequired: isMandatoryInput,
  };
};
