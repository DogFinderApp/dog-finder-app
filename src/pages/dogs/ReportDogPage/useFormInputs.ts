import { Dayjs } from "dayjs";
import { AppTexts } from "../../../consts/texts";
import { matchGender } from "../../../utils/matchGenderText";
import { DogSex, DogType } from "../../../types/payload.types";
import { useTextInput } from "../../../hooks/useTextInput";
import { useDateInput } from "../../../hooks/useDateInput";
import { useEmailInput } from "../../../hooks/useEmailInput";
import { usePhoneNumberInput } from "../../../hooks/usePhoneNumberInput";
import { useSelectInput } from "../../../hooks/useSelectInput";

export const useReportDogInputs = () => {
  const { reportPage } = AppTexts;
  const dogSexOptions = {
    [DogSex.FEMALE]: reportPage.dogSex.female,
    [DogSex.MALE]: reportPage.dogSex.male,
  };

  const inputs = {
    dogBreed: useTextInput({ isMandatoryInput: false }),
    dogSize: useSelectInput({
      isMandatoryInput: false,
      possibleValues: Object.keys(reportPage.dogSizeOptions),
    }),
    ageGroup: useSelectInput({
      isMandatoryInput: false,
      possibleValues: Object.keys(reportPage.dogAge),
    }),
    dogColor: useTextInput({ isMandatoryInput: false }),
    dogSex: useSelectInput({
      isMandatoryInput: false,
      possibleValues: Object.keys(dogSexOptions),
    }),
    chipNumber: useTextInput({ isMandatoryInput: false }),
    location: useTextInput({ isMandatoryInput: true }),
    date: useDateInput({ isMandatoryInput: false }),
    contactName: useTextInput({ isMandatoryInput: true }),
    contactPhone: usePhoneNumberInput({ isMandatoryInput: true }),
    contactEmail: useEmailInput({ isMandatoryInput: false }),
    contactAddress: useTextInput({ isMandatoryInput: false }),
    extraDetails: useTextInput({ isMandatoryInput: false }),
  };

  const getInputsData = (dogType: DogType) => {
    const locationText = reportPage.locationDetails[dogType];
    const dateText = reportPage.dateDetails[dogType];

    const phoneInputHelperText = !inputs.contactPhone.isPhoneValid
      ? reportPage.helperTexts.phone
      : "";

    const emailInputHelperText = !inputs.contactEmail.isEmailValid
      ? reportPage.helperTexts.email
      : "";

    const selectedGender = (inputs.dogSex.value as DogSex) || null;

    const ageText =
      // if the dogs is lost, their owner probably knows their age, we don't need to add "משוער"
      dogType === DogType.LOST
        ? matchGender(reportPage.dogDetails.dogAgeLost, selectedGender)
        : reportPage.dogDetails.dogAgeFound;

    interface InputData {
      name: keyof typeof inputs;
      label: string;
      required: boolean;
      onChange?: (event: any) => void;
      error?: boolean;
      multiline?: boolean;
      rows?: number;
      helperText?: string;
      placeholder?: string;
      options?: Record<string, string>;
      date?: Dayjs | null;
    }

    const inputsData: InputData[] = [
      {
        name: "dogBreed",
        label: matchGender(reportPage.dogDetails.dogRace, selectedGender),
        required: inputs.dogBreed.isRequired,
      },
      {
        name: "dogSize",
        options: reportPage.dogSizeOptions,
        label: matchGender(reportPage.dogDetails.dogSize, selectedGender),
        onChange: inputs.dogSize.onSelectChange,
        error: !inputs.dogSize.isValueValid,
        required: inputs.dogSize.isRequired,
      },
      {
        name: "dogSex",
        options: dogSexOptions,
        label: matchGender(reportPage.dogDetails.dogSex, selectedGender),
        onChange: inputs.dogSex.onSelectChange,
        error: !inputs.dogSex.isValueValid,
        required: inputs.dogSex.isRequired,
      },
      {
        name: "ageGroup",
        options: reportPage.dogAge,
        label: ageText,
        onChange: inputs.ageGroup.onSelectChange,
        error: !inputs.ageGroup.isValueValid,
        required: inputs.ageGroup.isRequired,
      },
      {
        name: "dogColor",
        label: reportPage.dogDetails.dogColor,
        required: inputs.dogColor.isRequired,
      },
      {
        name: "chipNumber",
        label: reportPage.dogDetails.chipNumber,
        required: inputs.chipNumber.isRequired,
      },
      {
        name: "date",
        label: matchGender(dateText, selectedGender),
        date: inputs.date.dateInput,
        onChange: inputs.date.handleDateChange,
        error: !inputs.date.isInputValid,
        required: inputs.date.isRequired,
      },
      {
        name: "location",
        label: matchGender(locationText, selectedGender),
        required: inputs.location.isRequired,
      },
      {
        name: "contactName",
        label: reportPage.extraDetails.contactName,
        required: inputs.contactName.isRequired,
        multiline: true,
        rows: 2,
      },
      {
        name: "contactPhone",
        label: reportPage.extraDetails.contactPhone,
        required: inputs.contactPhone.isRequired,
        onChange: inputs.contactPhone.onPhoneChange,
        error: !inputs.contactPhone.isPhoneValid,
        multiline: true,
        rows: 2,
        helperText: phoneInputHelperText,
        placeholder: reportPage.helperTexts.phonePlaceholder,
      },
      {
        name: "contactEmail",
        label: reportPage.extraDetails.contactEmail,
        required: inputs.contactEmail.isRequired,
        onChange: inputs.contactEmail.onEmailChange,
        error: !inputs.contactEmail.isEmailValid,
        multiline: true,
        rows: 2,
        helperText: emailInputHelperText,
      },
      {
        name: "contactAddress",
        label: reportPage.extraDetails.contactAddress,
        required: inputs.contactAddress.isRequired,
        multiline: true,
        rows: 2,
      },
      {
        name: "extraDetails",
        label: matchGender(
          reportPage.extraDetails.extraDetails,
          selectedGender,
        ),
        required: inputs.extraDetails.isRequired,
        multiline: true,
        rows: 5,
      },
    ];

    return inputsData;
  };

  return { inputs, getInputsData, dogSexOptions };
};
