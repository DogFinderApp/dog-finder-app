import {
  Button,
  Card,
  CardActions,
  CardMedia,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { IconGenderMale, IconGenderFemale } from "@tabler/icons-react";
import { createStyleHook } from "../../hooks/styleHooks";
import { formatDateString } from "../../utils/datesFormatter";
import { DogResult, DogType } from "../../facades/payload.types";
import { AppTexts } from "../../consts/texts";
import { AppRoutes } from "../../consts/routes";

interface DogCardProps {
  dog: DogResult;
  dogType: DogType;
}

export const DogCard = ({ dog, dogType }: DogCardProps) => {
  const useCardStyles = createStyleHook(() => ({
    CardMedia: { height: 400, objectFit: "contain" },
    CardActions: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: 1,
      background: "#fff",
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
  }));

  const styles = useCardStyles();
  const navigate = useNavigate();
  const { lastReportedId } = useParams();

  const navigateToSelectedDog = () => {
    navigate(
      AppRoutes.dogs.dogPage
        .replace(":dog_id", dog.dogId)
        .replace(":lastReportedId?", lastReportedId ?? ""),
      { state: { dogType, lastReportedId } },
    );
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

  return (
    <Card dir="rtl">
      <CardMedia
        image={image}
        component="img"
        title="Dog Image"
        sx={styles.CardMedia}
      />
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
