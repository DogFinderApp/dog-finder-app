import { Box, Button, ButtonOwnProps } from "@mui/material";
import { Link } from "react-router-dom";
import { IconPaw, IconSearch, TablerIconsProps } from "@tabler/icons-react";
import { createStyleHook } from "../../hooks/styleHooks";
import { useWindowSize } from "../../hooks/useWindowSize";
import { AppRoutes } from "../../consts/routes";
import { AppTexts } from "../../consts/texts";

export const StartFlowButtons = ({ alignRight }: { alignRight?: boolean }) => {
  const useStartFlowButtonsStyles = createStyleHook(() => ({
    content: {
      display: "flex",
      flexDirection: { xs: "column-reverse", sm: "row" },
      alignItems: "center",
      justifyContent: alignRight ? "flex-end" : "center",
      gap: 2,
    },
    button: {
      width: 240,
      height: 45,
    },
  }));

  const styles = useStartFlowButtonsStyles();
  const { isMobile } = useWindowSize();

  const commonIconProps: TablerIconsProps = {
    style: { marginRight: isMobile ? "auto" : "8px" },
    stroke: 1.5,
  };

  const commonButtonProps: ButtonOwnProps = {
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

  const scrollAfterNavigation = () => window.scroll({ top: 0 });

  const { foundDog, lostDog } = AppTexts.homePage.buttons;

  return (
    <Box sx={styles.content}>
      <Link
        to={AppRoutes.dogs.searchFoundDog}
        style={linkStyles}
        onClick={scrollAfterNavigation}
      >
        <Button {...commonButtonProps}>
          <IconSearch {...commonIconProps} />
          {lostDog}
        </Button>
      </Link>
      <Link
        to={AppRoutes.dogs.searchLostDog}
        style={linkStyles}
        onClick={scrollAfterNavigation}
      >
        <Button {...commonButtonProps}>
          <IconPaw {...commonIconProps} />
          {foundDog}
        </Button>
      </Link>
    </Box>
  );
};
