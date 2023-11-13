import { Box, Button, ButtonOwnProps } from "@mui/material";
import { Link } from "react-router-dom";
import { IconPaw } from "@tabler/icons-react";
import { IconSearch } from "@tabler/icons-react";
import { TablerIconsProps } from "@tabler/icons-react";
import { createStyleHook } from "../../hooks/styleHooks";
import { useWindowSize } from "../../hooks/useWindowSize";
import { AppRoutes } from "../../consts/routes";
import { AppTexts } from "../../consts/texts";

export const StartFlowButtons = ({ alignRight }: { alignRight?: boolean }) => {
  const useStartFlowButtonsStyles = createStyleHook(() => {
    return {
      content: {
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "center",
        justifyContent: alignRight ? "flex-end" : "center",
        gap: 2,
      },
      button: {
        width: 240,
        height: 45,
      },
    };
  });

  const styles = useStartFlowButtonsStyles();
  const { innerWidth } = useWindowSize();
  const isMobile = innerWidth < 600;

  const commonIconProps: TablerIconsProps = {
    style: { marginRight: isMobile ? "auto" : "8px" },
    stroke: 1.5,
  };

  const commonButtonProps: ButtonOwnProps = {
    size: "large",
    variant: "contained",
    sx: styles.button,
  };

  const linkStyles = {
    width: isMobile ? "100%" : "max-content",
    color: "white",
    textDecoration: "none",
    display: "flex",
    justifyContent: "center",
  };

  return (
    <Box sx={styles.content}>
      <Link to={AppRoutes.dogs.reportLost} style={linkStyles}>
        <Button {...commonButtonProps}>
          <IconSearch {...commonIconProps} />
          {AppTexts.homePage.cta.lostDog}
        </Button>
      </Link>
      <Link to={AppRoutes.dogs.reportFound} style={linkStyles}>
        <Button {...commonButtonProps}>
          <IconPaw {...commonIconProps} />
          {AppTexts.homePage.cta.foundDog}
        </Button>
      </Link>
    </Box>
  );
};
