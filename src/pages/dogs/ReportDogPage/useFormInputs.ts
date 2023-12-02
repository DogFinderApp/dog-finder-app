import { Dayjs } from "dayjs";
import { AppTexts } from "../../../consts/texts";
import { DogSex, DogType } from "../../../types/payload.types";
import { useTextInput } from "../../../hooks/useTextInput";
import { useDateInput } from "../../../hooks/useDateInput";
import { useEmailInput } from "../../../hooks/useEmailInput";
import { usePhoneNumberInput } from "../../../hooks/usePhoneNumberInput";
import { useSelectInput } from "../../../hooks/useSelectInput";

export const useReportDogInputs = () => {
  const dogSexOptions = {
    [DogSex.FEMALE]: AppTexts.reportPage.dogSex.female,
    [DogSex.MALE]: AppTexts.reportPage.dogSex.male,
  };

  const inputs = {
    dogBreed: useTextInput({ isMandatoryInput: false }),
    dogSize: useSelectInput({
      isMandatoryInput: false,
      possibleValues: Object.keys(AppTexts.reportPage.dogSizeOptions),
    }),
    ageGroup: useSelectInput({
      isMandatoryInput: false,
      possibleValues: Object.keys(AppTexts.reportPage.dogAge),
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
    const locationText =
      dogType === DogType.LOST
        ? AppTexts.reportPage.locationDetails.locationDescriptionLost
        : AppTexts.reportPage.locationDetails.locationDescriptionFound;

    const phoneInputHelperText = !inputs.contactPhone.isPhoneValid
      ? AppTexts.reportPage.helperTexts.phone
      : "";

    const emailInputHelperText = !inputs.contactEmail.isEmailValid
      ? AppTexts.reportPage.helperTexts.email
      : "";

    const dateText =
      dogType === DogType.LOST
        ? AppTexts.reportPage.dateDetails.lostDate
        : AppTexts.reportPage.dateDetails.foundDate;

    const matchGender = (text: string) => {
      const maleText = text.slice(0, text.length - 2); // remove prefix "ה/"
      if (inputs.dogSex.value === "male") return `${maleText}`;
      if (inputs.dogSex.value === "female") return `${maleText}ה`;
      return text; // if the gender input is empty
    };

    const ageText =
      // if the dogs is lost, their owner probably knows their age, we don't need to add "משוער"
      dogType === DogType.LOST
        ? matchGender(AppTexts.reportPage.dogDetails.dogAgeLost)
        : AppTexts.reportPage.dogDetails.dogAgeFound;

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
      //! don't forget to add "required={inputs[].isRequired"
      {
        name: "dogBreed",
        label: matchGender(AppTexts.reportPage.dogDetails.dogRace),
        required: inputs.dogBreed.isRequired,
      },
      {
        name: "dogSize",
        options: AppTexts.reportPage.dogSizeOptions,
        label: matchGender(AppTexts.reportPage.dogDetails.dogSize),
        onChange: inputs.dogSize.onSelectChange,
        error: !inputs.dogSize.isValueValid,
        required: inputs.dogSize.isRequired,
      },
      {
        name: "dogSex",
        options: dogSexOptions,
        label: matchGender(AppTexts.reportPage.dogDetails.dogSex),
        onChange: inputs.dogSex.onSelectChange,
        error: !inputs.dogSex.isValueValid,
        required: inputs.dogSex.isRequired,
      },
      {
        name: "ageGroup",
        options: AppTexts.reportPage.dogAge,
        label: ageText,
        onChange: inputs.ageGroup.onSelectChange,
        error: !inputs.ageGroup.isValueValid,
        required: inputs.ageGroup.isRequired,
      },
      {
        name: "dogColor",
        label: AppTexts.reportPage.dogDetails.dogColor,
        required: inputs.dogColor.isRequired,
      },
      {
        name: "chipNumber",
        label: AppTexts.reportPage.dogDetails.chipNumber,
        required: inputs.chipNumber.isRequired,
      },
      {
        name: "date",
        label: matchGender(dateText),
        date: inputs.date.dateInput,
        onChange: inputs.date.handleDateChange,
        error: !inputs.date.isInputValid,
        required: inputs.date.isRequired,
      },
      {
        name: "location",
        label: locationText,
        required: inputs.location.isRequired,
      },
      {
        name: "contactName",
        label: AppTexts.reportPage.extraDetails.contactName,
        required: inputs.contactName.isRequired,
        multiline: true,
        rows: 2,
      },
      {
        name: "contactPhone",
        label: AppTexts.reportPage.extraDetails.contactPhone,
        required: inputs.contactPhone.isRequired,
        onChange: inputs.contactPhone.onPhoneChange,
        error: !inputs.contactPhone.isPhoneValid,
        multiline: true,
        rows: 2,
        helperText: phoneInputHelperText,
        placeholder: AppTexts.reportPage.helperTexts.phonePlaceholder,
      },
      {
        name: "contactEmail",
        label: AppTexts.reportPage.extraDetails.contactEmail,
        required: inputs.contactEmail.isRequired,
        onChange: inputs.contactEmail.onEmailChange,
        error: !inputs.contactEmail.isEmailValid,
        multiline: true,
        rows: 2,
        helperText: emailInputHelperText,
      },
      {
        name: "contactAddress",
        label: AppTexts.reportPage.extraDetails.contactAddress,
        required: inputs.contactAddress.isRequired,
        multiline: true,
        rows: 2,
      },
      {
        name: "extraDetails",
        label: AppTexts.reportPage.extraDetails.extraDetails,
        required: inputs.extraDetails.isRequired,
        multiline: true,
        rows: 5,
      },
    ];

    return inputsData;
  };

  return { inputs, getInputsData, dogSexOptions };
};
