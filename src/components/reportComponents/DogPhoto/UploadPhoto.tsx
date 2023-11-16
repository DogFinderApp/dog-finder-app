import { Box, Typography, useTheme } from "@mui/material";
import { AppTexts } from "../../../consts/texts";
import { IconCameraUp } from "@tabler/icons-react";
import { ChangeEvent, FC, useCallback, useRef } from "react";
import { acceptableFormats } from "../../../consts/formats";
import { createStyleHook } from "../../../hooks/styleHooks";
import { AppShadows } from "../../../consts/shadows";

interface UploadPhotoProps {
  onSelectImage: (file: File) => Promise<void>;
  selectedImageUrl?: string;
  isError: boolean;
}

const useUploadPhotoStyles = createStyleHook(
  (theme, props: { isError: boolean }) => {
    return {
      root: {
        width: "100%",
        maxWidth: "500px",
        display: "flex",
        justifyContent: "center",
        boxShadow: AppShadows.toolbarShadow,
      },
      uploadButon: {
        width: "100%",
        maxWidth: "500px",
        height: "188px",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        borderRadius: "8px",
        border: props.isError ? `4px solid ${theme.palette.error.main}` : "",
        transition: "all 200ms ease-in-out",
      },
    };
  }
);

export const UploadPhoto: FC<UploadPhotoProps> = ({
  onSelectImage,
  selectedImageUrl,
  isError,
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const styles = useUploadPhotoStyles({ isError });
  const theme = useTheme();

  const handleChangeImage = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e?.target?.files?.[0];
      if (!file) return;

      onSelectImage(file);
    },
    [onSelectImage]
  );

  const uploadText = isError
    ? AppTexts.reportPage.photo.ctaError
    : AppTexts.reportPage.photo.cta;
  const buttonColors = isError
    ? theme.palette.error.light
    : theme.palette.primary.dark;

  return (
    <Box sx={styles.root}>
      <input
        ref={imageInputRef}
        type="file"
        id="image"
        accept={acceptableFormats.join(", ")}
        onChange={handleChangeImage}
        hidden
        style={{ display: "none" }}
      />
      <Box
        sx={styles.uploadButon}
        onClick={() => imageInputRef?.current?.click()}
      >
        <IconCameraUp
          style={{ marginBottom: "8px" }}
          size={"60px"}
          strokeWidth={1}
          color={buttonColors}
        />
        <Typography
          color={buttonColors}
          textAlign={"center"}
          sx={{ textWrap: "balance" }}
        >
          {uploadText}
        </Typography>
        <Typography color={buttonColors} textAlign={"center"}>
          {AppTexts.reportPage.photo.ctaNote}
        </Typography>
      </Box>
    </Box>
  );
};
