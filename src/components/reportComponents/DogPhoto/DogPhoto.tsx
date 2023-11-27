import { FC } from "react";
import { Box } from "@mui/material";
import { IconTrash } from "@tabler/icons-react";
import { createStyleHook } from "../../../hooks/styleHooks";
import { PageImage } from "../../pageComponents/PageImage/PageImage";
import { AppShadows } from "../../../consts/shadows";
import { UploadPhoto } from "./UploadPhoto";

const useDogPhotoStyles = createStyleHook(() => ({
  root: {
    width: "100%",
    maxWidth: "500px",
    display: "flex",
    justifyContent: "center",
    position: "relative",
    boxShadow: AppShadows.toolbarShadow,
  },
  photo: {
    width: "100%",
    maxWidth: "500px",
    minHeight: "188px",
    maxHeight: "350px",
    borderRadius: "8px",
    objectFit: "cover",
  },
  deleteButton: {
    position: "absolute",
    zIndex: "30",
    borderRadius: "100%",
    padding: "8px",
    backgroundColor: "white",
    right: 15,
    bottom: 15,
    boxShadow: AppShadows.deleteButtonShadow,
    cursor: "pointer",
  },
}));

interface DogPhotoProps {
  onSelectImage: (file: File) => Promise<void>;
  selectedImageUrl?: string;
  clearSelection: VoidFunction;
  isError: boolean;
}

export const DogPhoto: FC<DogPhotoProps> = ({
  onSelectImage,
  selectedImageUrl,
  clearSelection,
  isError,
}) => {
  const styles = useDogPhotoStyles();

  if (!selectedImageUrl) {
    return <UploadPhoto onSelectImage={onSelectImage} isError={isError} />;
  }

  return (
    <Box sx={styles.root}>
      <PageImage src={selectedImageUrl} alt="dog-photo" sx={styles.photo} />
      <Box sx={styles.deleteButton} onClick={() => clearSelection()}>
        <IconTrash strokeWidth={1.5} />
      </Box>
    </Box>
  );
};
