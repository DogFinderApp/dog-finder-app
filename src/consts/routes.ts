import { FC } from "react";
import { DogType } from "../facades/payload.types";
import { HomePage } from "./../pages/root/HomePage";
import { PrivacyPolicy } from "./../pages/PrivacyPolicy/PrivacyPolicy";
import { ReportDogPage } from "../pages/dogs/ReportDogPage";
import { SearchDogPage } from "../pages/dogs/SearchDogPage";
import { ResultsDogPage } from "../pages/dogs/ResultsDogPage";
import { DogDetailsPage } from "../pages/dogs/DogDetailsPage";

export const AppRoutes = {
  root: "/",
  privacyPolicy: "/PrivacyPolicy",
  dogs: {
    dogPage: "/dogs/:dog_id/:lastReportedId?",
    reportFound: "/dogs/report-found",
    reportLost: "/dogs/report-missing",
    searchLostDog: "/dogs/search-lost",
    searchFoundDog: "/dogs/search-found",
    results: "/dogs/results/:dogType/:lastReportedId?",
  },
};

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
];
