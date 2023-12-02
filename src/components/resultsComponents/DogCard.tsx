import { useState } from "react";
import {
  Box,
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
  IconTrash,
} from "@tabler/icons-react";
import { formatDateString } from "../../utils/datesFormatter";
import { useGetServerApi } from "../../facades/ServerApi";
import { useAuthContext } from "../../context/useAuthContext";
import { createStyleHook } from "../../hooks/styleHooks";
import { useWindowSize } from "../../hooks/useWindowSize";
import { DogResult, DogType } from "../../types/payload.types";
import { AppTexts } from "../../consts/texts";
import { AppRoutes } from "../../consts/routes";
import { DeleteReportModal } from "../Modals/DeleteReportModal";

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
      absoluteContainer: {
        position: "absolute",
        right: 8,
        top: 8,
        display: "flex",
        gap: 1.5,
      },
      iconButton: {
        minWidth: "unset",
        width: "max-content",
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

interface DogCardProps {
  dog: DogResult;
  dogType: DogType;
  getUpdatedReports?: Function; // refetch after deleting a report
}

export const DogCard = ({ dog, dogType, getUpdatedReports }: DogCardProps) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const getServerApi = useGetServerApi();
  const navigate = useNavigate();
  const { innerWidth } = useWindowSize();
  const isMobile = innerWidth < 600;
  const styles = useCardStyles({ isHovering, isMobile });
  const {
    state: { role },
  } = useAuthContext();

  const deleteReport = async () => {
    const serverApi = await getServerApi();
    try {
      setIsDeleting(true);
      const response = await serverApi.deleteDogById(dog.dogId);
      setIsDeleting(false);
      if (response?.ok) {
        setIsDeleteModalOpen(false);
        if (getUpdatedReports) {
          getUpdatedReports();
        }
      }
    } catch (error) {
      console.error(error); // eslint-disable-line
      throw new Error("Failed to fetch reports");
    }
  };

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

  const openDeleteReportModal = () => setIsDeleteModalOpen(true);

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
  const searchToolTipText =
    dog.type === "found"
      ? AppTexts.dogCard.toolTipLost
      : AppTexts.dogCard.toolTipFound;

  return (
    <>
      <DeleteReportModal
        open={isDeleteModalOpen}
        isDeleting={isDeleting}
        setOpen={setIsDeleteModalOpen}
        deleteFunction={deleteReport}
      />
      <Card
        dir="rtl"
        sx={{ position: "relative" }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <CardMedia image={image} component="img" sx={styles.CardMedia} />
        {!!role && (
          <Box sx={styles.absoluteContainer}>
            <Tooltip title={searchToolTipText} placement="top">
              <Button
                variant="contained"
                sx={styles.iconButton}
                onClick={searchForSimilarDogs}
              >
                <IconSearch width={25} />
              </Button>
            </Tooltip>
            {role === "admin" && (
              <Tooltip title={AppTexts.dogCard.tooltipDelete} placement="top">
                <Button
                  variant="contained"
                  color="error"
                  sx={styles.iconButton}
                  onClick={openDeleteReportModal}
                >
                  <IconTrash width={25} />
                </Button>
              </Tooltip>
            )}
          </Box>
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
    </>
  );
};
