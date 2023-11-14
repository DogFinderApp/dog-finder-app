import { AppRoutes } from "../../../consts/routes";
import { AppTexts } from "../../../consts/texts";

export const links = [
  {
    href: AppRoutes.root,
    text: AppTexts.navigation.home,
  },
  {
    href: AppRoutes.about,
    text: AppTexts.aboutUsTitle,
  },
  {
    href: AppRoutes.dogs.reportFound,
    text: AppTexts.navigation.reportFound,
  },
  {
    href: AppRoutes.dogs.reportLost,
    text: AppTexts.navigation.searchLostDog,
  },
  {
    href: AppRoutes.privacyPolicy,
    text: AppTexts.privacyPolicyTitle,
  },
];
