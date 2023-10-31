import {
  Button,
  Card,
  CardActions,
  CardMedia,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { IconGenderMale, IconGenderFemale } from "@tabler/icons-react";
import { createStyleHook } from "../../hooks/styleHooks";
import { DogResult, DogType } from "../../facades/payload.types";
import { AppTexts } from "../../consts/texts";
import { AppRoutes } from "../../consts/routes";

interface DogCardProps {
  dog: DogResult;
  dogType: DogType;
}

export const DogCard = ({ dog, dogType }: DogCardProps) => {
  const useCardStyles = createStyleHook(() => {
    return {
      CardMedia: { height: 400, objectFit: "fill" },
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
    };
  });

  const styles = useCardStyles();
  const navigate = useNavigate();

  const navigateToSelectedDog = () =>
    navigate(AppRoutes.dogs.dogPage.replace(":dog_id", dog.dogId), {
      state: { dogType },
    });

  const isMaleGender = dog.sex?.toLowerCase() === "male";

  const genderIcon = isMaleGender ? (
    <IconGenderMale color="#116DFF" />
  ) : (
    <IconGenderFemale color="#ef11ff" />
  );

  const genderText = isMaleGender
    ? AppTexts.reportPage.dogSex.male
    : AppTexts.reportPage.dogSex.female;

  const cardInfo = [
    `${AppTexts.dogCard.locationText}: ${dog.location}`,
    `${AppTexts.dogCard.sexText}: ${genderText}`,
    `${AppTexts.dogCard.reportedAt}: ${dog.createdAt}`,
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
            {sectionText} {index === 1 && genderIcon}
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
