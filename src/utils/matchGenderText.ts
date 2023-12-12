export const matchGender = (text: string, gender: "male" | "female" | null) => {
  // accepts a string that ends with "ה/" prefix
  // returns the string with or without "ה" according to the given gender.
  if (!text.endsWith("/ה"))
    throw new Error(
      `the following text does not end with the required prefix "/ה":\n${text}`,
    );
  const maleText = text.slice(0, text.length - 2); // remove prefix "ה/"
  if (gender === "male") return `${maleText}`;
  if (gender === "female") return `${maleText}ה`;
  return text; // if the gender arg is null
};
