import { useState } from "react";
import { Box, Button } from "@mui/material";
import { KeyedMutator } from "swr";
import { IconCheck, IconTrash } from "@tabler/icons-react";
import { useGetServerApi } from "../../../facades/ServerApi";
import { AppTexts } from "../../../consts/texts";
import { DogResult, MatchingReports } from "../../../types/payload.types";
import { createStyleHook } from "../../../hooks/styleHooks";
import WhatsappIcon from "../../../assets/svg/whatsapp.svg";

type LoadingState = "deleting" | "resolving" | null;

const useCardButtonsStyles = createStyleHook(
  (theme, { loadingState }: { loadingState: LoadingState }) => {
    return {
      filler: { height: "80px" },
      whatsappButton: {
        m: "0 auto",
        fontSize: 16,
        fontWeight: 600,
        color: "#116DFF",
        width: "100%",
      },
      MatchButtons: {
        width: "100%",
        fontSize: 16,
        fontWeight: 600,
        display: "flex",
        gap: "4px",
        cursor: loadingState ? "not-allowed" : "pointer",
      },
    };
  },
);

interface MatchingReportsButtonsProps {
  dog: DogResult;
  dogId: number;
  // we can't just use `dog.dogId` from the previous arg because the passed dog could be either found or lost,
  // and the bottom buttons are for lost reports ONLY. we must make sure we can separate between the 2 IDs
  possibleMatchId: number;
  dogPairId: number;
  getUpdatedPossibleMatches: KeyedMutator<void | {
    results: MatchingReports[];
    pagination: any;
  }>;
}

export const MatchingReportsButtons = ({
  dog,
  dogId,
  possibleMatchId,
  dogPairId,
  getUpdatedPossibleMatches,
}: MatchingReportsButtonsProps) => {
  const getServerApi = useGetServerApi();
  const fullWidth = { width: "100%" };
  const [loadingState, setLoadingState] = useState<LoadingState>(null);
  const styles = useCardButtonsStyles({ loadingState });

  const { contactReporter, deleteMatch, confirmMatch, updating, whatsappText } =
    AppTexts.dogCard;

  const whatsappLink = `https://wa.me/${dog.contactPhone}/?text=${whatsappText}`;
  const confirmText = loadingState === "resolving" ? updating : confirmMatch;
  const deleteText = loadingState === "deleting" ? updating : deleteMatch;

  const markMatchAsResolved = async () => {
    const serverApi = await getServerApi();
    try {
      setLoadingState("resolving");
      const response = await serverApi.resolvePossibleMatch({
        dogId,
        possibleMatchId,
      });
      setLoadingState(null);
      if (response?.ok) getUpdatedPossibleMatches();
    } catch (error) {
      console.error(error); // eslint-disable-line
      setLoadingState(null);
      throw new Error("Failed to mark dogs as resolved");
    }
  };

  const deletePossibleMatch = async () => {
    const serverApi = await getServerApi();
    try {
      setLoadingState("deleting");
      const response = await serverApi.deletePossibleDogMatch(dogPairId);
      setLoadingState(null);
      if (response?.ok) getUpdatedPossibleMatches();
    } catch (error) {
      console.error(error); // eslint-disable-line
      setLoadingState(null);
      throw new Error("Failed to delete dog match");
    }
  };

  return (
    <Box sx={fullWidth}>
      {dog.type === "found" ? (
        <Box sx={styles.filler} /> // filler to match the heights of both cards
      ) : (
        <>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            style={fullWidth}
          >
            <Button sx={styles.whatsappButton}>
              {contactReporter}
              <img
                src={WhatsappIcon}
                alt="Whatsapp"
                style={{ marginRight: "4px" }}
              />
            </Button>
          </a>
          <Box sx={{ ...fullWidth, display: "flex" }}>
            <Button
              sx={styles.MatchButtons}
              color="error"
              onClick={(event) =>
                loadingState ? event.preventDefault() : deletePossibleMatch()
              }
            >
              {deleteText} <IconTrash width={25} />
            </Button>
            <Button
              sx={styles.MatchButtons}
              color="success"
              onClick={(event) =>
                loadingState ? event.preventDefault() : markMatchAsResolved()
              }
            >
              {confirmText} <IconCheck width={25} />
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};
