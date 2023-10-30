import { DogType } from "../facades/payload.types";
import { DogSex } from "../facades/payload.types";
import { AppTexts } from "../consts/texts";
import { useTextInput } from "./useTextInput";
import { useDateInput } from "./useDateInput";
import { useEmailInput } from "./useEmailInput";
import { usePhoneNumberInput } from "./usePhoneNumberInput";
import { useSelectInput } from "./useSelectInput";

export const useReportDogInputs = () => {
  const dogSexOptions = {
    [DogSex.FEMALE]: AppTexts.reportPage.dogSex.female,
    [DogSex.MALE]: AppTexts.reportPage.dogSex.male,
  };

  const inputs = {
    dogBreed: useTextInput({ isMandatoryInput: false }),
    dogSize: useTextInput({ isMandatoryInput: false }),
    dogColor: useTextInput({ isMandatoryInput: false }),
    dogSex: useSelectInput({
      isMandatoryInput: true,
      possibleValues: Object.keys(dogSexOptions),
    }),
    chipNumber: useTextInput({ isMandatoryInput: false }),
    location: useTextInput({ isMandatoryInput: true }),
    date: useDateInput({ isMandatoryInput: true }),
    contactName: useTextInput({ isMandatoryInput: true }),
    contactPhone: usePhoneNumberInput({ isMandatoryInput: true }),
    contactEmail: useEmailInput({ isMandatoryInput: true }),
    contactAddress: useTextInput({ isMandatoryInput: false }),
    extraDetails: useTextInput({ isMandatoryInput: false }),
  };

  interface InputData {
    name: keyof typeof inputs;
    label: string;
    onChange?: (event: any) => void;
    error?: boolean;
    multiline?: boolean;
    rows?: number;
  }

  const getInputsData = (dogType: DogType) => {
    const locationText =
      dogType === DogType.LOST
        ? AppTexts.reportPage.locationDetails.locationDescriptionLost
        : AppTexts.reportPage.locationDetails.locationDescriptionFound;

    const inputsData: InputData[] = [
      {
        name: "dogBreed",
        label: AppTexts.reportPage.dogDetails.dogRace,
      },
      {
        name: "dogSize",
        label: AppTexts.reportPage.dogDetails.dogSize,
      },
      {
        name: "dogColor",
        label: AppTexts.reportPage.dogDetails.dogColor,
      },
      {
        name: "chipNumber",
        label: AppTexts.reportPage.dogDetails.chipNumber,
      },
      {
        name: "location",
        label: locationText,
      },
      {
        name: "contactName",
        label: AppTexts.reportPage.extraDetails.contactName,
        multiline: true,
        rows: 2,
      },
      {
        name: "contactPhone",
        label: AppTexts.reportPage.extraDetails.contactPhone,
        onChange: inputs.contactPhone.onPhoneChange,
        error: !inputs.contactPhone.isPhoneValid,
        multiline: true,
        rows: 2,
      },
      {
        name: "contactEmail",
        label: AppTexts.reportPage.extraDetails.contactEmail,
        onChange: inputs.contactEmail.onEmailChange,
        error: !inputs.contactEmail.isEmailValid,
        multiline: true,
        rows: 2,
      },
      {
        name: "contactAddress",
        label: AppTexts.reportPage.extraDetails.contactAddress,
        multiline: true,
        rows: 2,
      },
      {
        name: "extraDetails",
        label: AppTexts.reportPage.extraDetails.extraDetails,
        multiline: true,
        rows: 5,
      },
    ];

    return inputsData;
  };

  return { inputs, getInputsData, dogSexOptions };
};
