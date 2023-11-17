import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_KEY ?? "";

export const encryptData = (name: string, data: any) => {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    SECRET_KEY,
  ).toString();
  localStorage.setItem(name, encrypted);
};

export const decryptData = (name: string) => {
  const encrypted = localStorage.getItem(name);
  if (!encrypted) {
    console.error("Can't find encrypted data from localStorage"); // eslint-disable-line
    return null;
  }
  const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY).toString(
    CryptoJS.enc.Utf8,
  );
  return JSON.parse(decrypted) || null;
};
