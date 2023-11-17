import { AppRoutes } from "../../../consts/routes";
import { AppTexts } from "../../../consts/texts";

export const links = [
  {
    href: AppRoutes.root,
    text: AppTexts.navigation.home,
  },
  {
    href: AppRoutes.dogs.reportFound,
    text: AppTexts.navigation.reportFound,
  },
  {
    href: AppRoutes.dogs.reportLost,
    text: AppTexts.navigation.reportLost,
  },
  {
    href: AppRoutes.about,
    text: AppTexts.navigation.aboutUs,
  },
  {
    href: AppRoutes.privacyPolicy,
    text: AppTexts.navigation.privacyPolicy,
  },
];

export const hamalLinks = [
  {
    href: AppRoutes.dogs.allReports.replace(":dogType", "found"),
    text: AppTexts.navigation.allFound,
  },
  {
    href: AppRoutes.dogs.allReports.replace(":dogType", "lost"),
    text: AppTexts.navigation.allLost,
  },
  {
    href: AppRoutes.dogs.allReports.replace("/:dogType", ""),
    text: AppTexts.allReportsPage.title,
  },
];
