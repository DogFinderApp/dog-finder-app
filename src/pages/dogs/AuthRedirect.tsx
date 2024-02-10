// ? This blank page solves the following issue:
// ? if we send the user to authenticate from `DogDetailsPage`, we want them to return to the same
// ? page at the end. But we can't specify `...domain/dogs/*` as an allowed callback URL for Auth0
// ? because it cannot accept the wildcard '*'. So instead will use to this blank page, and from here
// ? we will redirect the user back to the dog page - using the dogId we stored in localStorage earlier

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { decryptData } from "../../utils/encryptionUtils";

export const AuthRedirect = () => {
  const navigate = useNavigate();
  const dogId = decryptData("dog_id_to_redirect");

  useEffect(() => {
    setTimeout(() => {
      if (dogId) {
        navigate(`/dogs/${dogId}/authenticated`);
        localStorage.removeItem("dog_id_to_redirect");
      }
    }, 100);
  }, [dogId, navigate]);
  return <div />;
};
