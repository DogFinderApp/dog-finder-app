import {
  Box,
  Button,
  SelectChangeEvent,
  Typography,
  useTheme,
} from "@mui/material";
import { AppTexts } from "../../consts/texts";
import { PageContainer } from "../../components/pageComponents/PageContainer/PageContainer";
import { PageTitle } from "../../components/pageComponents/PageTitle/PageTitle";
import { DogPhoto } from "../../components/reportComponents/DogPhoto/DogPhoto";
import { useImageSelection } from "../../hooks/useImageSelection";
import { IconSearch } from "@tabler/icons-react";
import { DogType, QueryPayload } from "../../facades/payload.types";
import { useState } from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { cleanImage } from "../../utils/imageUtils";
import { useNavigate } from "react-router-dom";
import { RTLWrapper } from "../../components/common/RTLWrapper";
import { AppRoutes } from "../../consts/routes";


interface SearchProps {
  dogType: DogType
};

export const SearchDogPage = withAuthenticationRequired((props: SearchProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { onSelectImage, selectedImageFile, selectedImageUrl, clearSelection } =
    useImageSelection();
  const { dogType } = props;
  
  const [isMissingPhoto, setIsMissingPhoto] = useState(false);

  const onClickSearch = async () => {
    if (!selectedImageUrl || !selectedImageFile) {
      setIsMissingPhoto(true);
      return;
    }

    if (!selectedImageUrl) {
      return;
    }
    const imageInput = await cleanImage(selectedImageUrl);
    const payload: QueryPayload = {
      dogType: dogType,
      base64Image: imageInput,
    };

    navigate(AppRoutes.dogs.results.replace(":dogType", dogType), { state: payload });
    return;
  };

  const isFound = () => {
    return dogType === DogType.FOUND;
  }

  return (
    <PageContainer>
      <Box
        height={"100%"}
        width={"100%"}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        gap={"24px"}
      >
        <PageTitle text={AppTexts.searchPage.title} />
        {
          isFound() && 
          <RTLWrapper>
            <Typography color={theme.palette.text.primary}>{AppTexts.searchPage.beforeReportingLost}</Typography>
          </RTLWrapper>
        }
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
});
