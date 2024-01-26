import { useEffect, useState } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { IconSearch } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { AppTexts } from "../../consts/texts";
import { PageContainer } from "../../components/pageComponents/PageContainer/PageContainer";
import { PageTitle } from "../../components/pageComponents/PageTitle/PageTitle";
import { DogPhoto } from "../../components/reportComponents/DogPhoto/DogPhoto";
import { useImageSelection } from "../../hooks/useImageSelection";
import usePageTitle from "../../hooks/usePageTitle";
import { DogType, QueryPayload } from "../../types/payload.types";
import { cleanImage } from "../../utils/imageUtils";
import { RTLWrapper } from "../../components/common/RTLWrapper";
import { AppRoutes } from "../../consts/routes";

interface SearchProps {
  dogType: DogType;
}

export const SearchDogPage = ({ dogType }: SearchProps) => {
  usePageTitle(AppTexts.searchPage.title);
  const navigate = useNavigate();
  const theme = useTheme();
  const {
    onSelectImage,
    selectedImageFile,
    selectedImageUrl,
    clearSelection,
    setImageURL,
  } = useImageSelection();
  const [isMissingPhoto, setIsMissingPhoto] = useState(false);

  useEffect(() => {
    // delete the memorized image from localStorage to prevent it from being auto-loaded
    // we use useEffect because we want to delete that image only if it exists in the 1st render
    localStorage.removeItem("searchedDogImage");
    setImageURL(undefined);
  }, [setImageURL]);

  const onClickSearch = async () => {
    if (!selectedImageUrl || !selectedImageFile) {
      setIsMissingPhoto(true);
      return;
    }

    if (!selectedImageUrl) return;
    const imageInput = cleanImage(selectedImageUrl);
    const payload: QueryPayload = {
      type: dogType,
      base64Image: imageInput,
    };

    navigate(AppRoutes.dogs.results.replace(":dogType", dogType), {
      state: { ...payload, type: dogType },
    });
  };

  const isFound = dogType === DogType.FOUND;
  const searchText = isFound
    ? AppTexts.searchPage.searchFound
    : AppTexts.searchPage.searchLost;

  return (
    <PageContainer>
      <Box
        height="100%"
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap="24px"
      >
        <PageTitle text={AppTexts.searchPage.title} />
        <RTLWrapper>
          <Typography
            color={theme.palette.text.primary}
            sx={{ textAlign: "center", textWrap: "balance" }}
            fontSize={18}
          >
            {searchText}
          </Typography>
        </RTLWrapper>
        <DogPhoto
          onSelectImage={onSelectImage}
          selectedImageUrl={selectedImageUrl}
          clearSelection={clearSelection}
          isError={isMissingPhoto}
        />
        <Button size="large" variant="contained" onClick={onClickSearch}>
          <IconSearch style={{ marginRight: "8px" }} stroke={1.5} />
          {AppTexts.searchPage.submit}
        </Button>
      </Box>
    </PageContainer>
  );
};
