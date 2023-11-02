import { AppRoutes } from "../../../consts/routes";
import { AppTexts } from "../../../consts/texts";

export const links = [
  {
    href: AppRoutes.root,
    text: AppTexts.navigation.home,
  },
  {
    href: AppRoutes.dogs.searchLostDog,
    text: AppTexts.navigation.searchLostDog,
  },
  {
    href: AppRoutes.dogs.searchFoundDog,
    text: AppTexts.navigation.searchFoundDog,
  },
  {
    href: AppRoutes.dogs.reportFound,
    text: AppTexts.navigation.reportFound,
  },
  {
    href: AppRoutes.privacyPolicy,
    text: AppTexts.privacyPolicy.tabTitle,
  },
];
