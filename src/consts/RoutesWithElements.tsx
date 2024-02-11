import { FC } from "react";
import { DogType } from "../types/payload.types";
import { HomePage } from "../pages/root/HomePage";
import { PrivacyPolicy } from "../pages/PrivacyPolicy/PrivacyPolicy";
import { AboutUsPage } from "../pages/AboutUs/AboutUsPage";
import { ReportDogPage } from "../pages/dogs/ReportDogPage/ReportDogPage";
import { SearchDogPage } from "../pages/dogs/SearchDogPage";
import { ResultsDogPage } from "../pages/dogs/ResultsDogPage";
import { DogDetailsPage } from "../pages/dogs/DogDetailsPage/DogDetailsPage";
import { AllReportsPage } from "../pages/dogs/AllReportsPage";
import { AllMatchesPage } from "../pages/dogs/AllMatchesPage";
import { NotFound } from "../pages/NotFound";
import { ReportsGalleryPage } from "../pages/dogs/ReportsGalleryPage";
import { AuthRedirect } from "../pages/dogs/AuthRedirect";
import { AppRoutes } from "./routes";

type RouteElement = () => JSX.Element;

interface Route {
  path: string;
  element: RouteElement | FC<any>;
  props?: Record<any, any>;
}

export const routesWithElements: Route[] = [
  {
    path: AppRoutes.root,
    element: HomePage,
  },
  {
    path: AppRoutes.privacyPolicy,
    element: PrivacyPolicy,
  },
  {
    path: AppRoutes.about,
    element: AboutUsPage,
  },
  {
    path: AppRoutes.dogs.reportLost,
    element: ReportDogPage as RouteElement,
    props: { dogType: DogType.LOST },
  },
  {
    path: AppRoutes.dogs.reportFound,
    element: ReportDogPage as RouteElement,
    props: { dogType: DogType.FOUND },
  },
  {
    path: AppRoutes.dogs.searchLostDog,
    element: SearchDogPage as RouteElement,
    props: { dogType: DogType.LOST },
  },
  {
    path: AppRoutes.dogs.searchFoundDog,
    element: SearchDogPage as RouteElement,
    props: { dogType: DogType.FOUND },
  },
  {
    path: AppRoutes.dogs.results,
    element: ResultsDogPage,
  },
  {
    path: AppRoutes.dogs.dogPage,
    element: DogDetailsPage,
  },
  {
    path: AppRoutes.dogs.dogPageAuthenticated,
    element: DogDetailsPage,
  },
  {
    path: AppRoutes.dogs.allReports,
    element: ReportsGalleryPage,
  },
  {
    path: AppRoutes.dogs.allReportsHamal,
    element: AllReportsPage,
  },
  {
    path: AppRoutes.dogs.allMatches,
    element: AllMatchesPage,
  },
  {
    path: AppRoutes.dogs.redirect,
    element: AuthRedirect,
  },
  {
    path: "/*",
    element: NotFound,
  },
];
