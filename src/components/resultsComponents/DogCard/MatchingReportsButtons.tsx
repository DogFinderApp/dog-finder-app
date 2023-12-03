import { Box, Button } from "@mui/material";
import { IconCheck, IconTrash } from "@tabler/icons-react";
import { AppTexts } from "../../../consts/texts";
import { DogResult } from "../../../types/payload.types";
import { createStyleHook } from "../../../hooks/styleHooks";
import WhatsappIcon from "../../../assets/svg/whatsapp.svg";

const useCardButtonsStyles = createStyleHook(() => {
  return {
    filler: { height: "40px" },
    BottomButton: {
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
    },
  };
});

export const MatchingReportsButtons = ({ dog }: { dog: DogResult }) => {
  const styles = useCardButtonsStyles();
  const fullWidth = { width: "100%" };

  const { contactReporter, deleteMatch, confirmMatch, whatsappText } =
    AppTexts.dogCard;

  const whatsappLink = `https://wa.me/${dog.contactPhone}/?text=${whatsappText}`;

  return (
    <Box sx={fullWidth}>
      {dog.type === "found" ? (
        <Box sx={styles.filler} /> // filler to match the heights of both cards
      ) : (
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          style={fullWidth}
        >
          <Button sx={styles.BottomButton}>
            {contactReporter}
            <img
              src={WhatsappIcon}
              alt="Whatsapp"
              style={{ marginRight: "4px" }}
            />
          </Button>
        </a>
      )}
      <Box sx={{ ...fullWidth, display: "flex" }}>
        <Button sx={styles.MatchButtons} color="error">
          {deleteMatch} <IconTrash width={25} />
        </Button>
        <Button sx={styles.MatchButtons} color="success">
          {confirmMatch} <IconCheck width={25} />
        </Button>
      </Box>
    </Box>
  );
};
