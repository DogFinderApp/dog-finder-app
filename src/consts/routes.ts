export const AppRoutes = {
  root: "/",
  privacyPolicy: "/PrivacyPolicy",
  about: "/about",
  dogs: {
    dogPage: "/dogs/:dog_id/:lastReportedId?",
    reportFound: "/report-found",
    reportLost: "/report-lost",
    searchFoundDog: "/search-found",
    searchLostDog: "/search-lost",
    results: "/results/:dogType/:lastReportedId?",
    allReports: "/all-reports/:dogType?",
  },
};
