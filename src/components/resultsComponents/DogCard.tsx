import { useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardMedia,
  Tooltip,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  IconGenderMale,
  IconGenderFemale,
  IconSearch,
} from "@tabler/icons-react";
import { useAuthContext } from "../../context/useAuthContext";
import { createStyleHook } from "../../hooks/styleHooks";
import { useWindowSize } from "../../hooks/useWindowSize";
import { formatDateString } from "../../utils/datesFormatter";
import { DogResult, DogType } from "../../facades/payload.types";
import { AppTexts } from "../../consts/texts";
import { AppRoutes } from "../../consts/routes";

interface DogCardProps {
  dog: DogResult;
  dogType: DogType;
}

interface CardStyles {
  isHovering: boolean;
  isMobile: boolean;
}

const useCardStyles = createStyleHook(
  (theme, { isHovering, isMobile }: CardStyles) => {
    return {
      CardMedia: { height: 400, objectFit: "contain" },
      CardActions: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 1,
        background: "#fff",
      },
      searchIconButton: {
        position: "absolute",
        right: 8,
        top: 8,
        minWidth: "unset",
        padding: 1,
        borderRadius: "100%",
        opacity: isHovering || isMobile ? 1 : 0,
        transition: "0.2s ease-in-out",
      },
      BottomButton: {
        m: "0 auto",
        fontSize: 18,
        fontWeight: 600,
        color: "#116DFF",
        width: "100%",
      },
      Typography: {
        color: "#343842",
        fontWeight: 600,
        display: "flex",
        gap: "2px",
        alignItems: "center",
      },
    };
  },
);

export const DogCard = ({ dog, dogType }: DogCardProps) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const { innerWidth } = useWindowSize();
  const isMobile = innerWidth < 600;
  const styles = useCardStyles({ isHovering, isMobile });
  const navigate = useNavigate();
  const {
    state: { isHamalUser },
  } = useAuthContext();

  const navigateToSelectedDog = () => {
    navigate(AppRoutes.dogs.dogPage.replace(":dog_id", dog.dogId), {
      state: { dogType },
    });
  };

  const searchForSimilarDogs = () => {
    const dogTypeToSearch = dog.type === "found" ? "lost" : "found";
    const url = AppRoutes.dogs.results.replace(":dogType", dogTypeToSearch);
    navigate(url, {
      state: { type: dogTypeToSearch, base64Image: dog.imageBase64 },
    });
  };

  const isMaleGender = dog.sex?.toLowerCase() === "male";

  const genderIcon = isMaleGender ? (
    <IconGenderMale color="#116DFF" />
  ) : (
    <IconGenderFemale color="#ef11ff" />
  );

  const genderText = dog.sex
    ? isMaleGender
      ? AppTexts.reportPage.dogSex.male
      : AppTexts.reportPage.dogSex.female
    : "לא ידוע";

  const reportType =
    dogType === "found"
      ? AppTexts.dogCard.foundDate
      : AppTexts.dogCard.lostDate;

  const locationType =
    dogType === "found"
      ? AppTexts.dogCard.foundLocation
      : AppTexts.dogCard.lostLocation;

  const cardInfo = [
    `${locationType}: ${dog.location || ""}`,
    `${AppTexts.dogCard.sexText}: ${genderText}`,
    `${reportType}: ${formatDateString(dog.dogFoundOn || "")}`,
  ];

  const image = `data:${dog.imageContentType};base64,${dog.imageBase64}`;
  const toolTipText =
    dog.type === "found"
      ? AppTexts.dogCard.toolTipLost
      : AppTexts.dogCard.toolTipFound;

  return (
    <Card
      dir="rtl"
      sx={{ position: "relative" }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CardMedia image={image} component="img" sx={styles.CardMedia} />
      {isHamalUser && (
        <Tooltip title={toolTipText} placement="top">
          <Button
            variant="contained"
            sx={styles.searchIconButton}
            onClick={searchForSimilarDogs}
          >
            <IconSearch width={25} />
          </Button>
        </Tooltip>
      )}
      <CardActions sx={{ ...styles.CardActions, pr: 2, pt: 2 }}>
        {cardInfo.map((sectionText, index) => (
          <Typography key={sectionText} sx={styles.Typography}>
            {sectionText} {index === 1 && dog.sex && genderIcon}
          </Typography>
        ))}
      </CardActions>
      <CardActions sx={styles.CardActions}>
        <Button sx={styles.BottomButton} onClick={navigateToSelectedDog}>
          {AppTexts.resultsPage.moreDetails}
        </Button>
      </CardActions>
    </Card>
  );
};
