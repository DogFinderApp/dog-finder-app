export const AppRoutes = {
  root: "/",
  privacyPolicy: "/PrivacyPolicy",
  about: "/about",
  dogs: {
    dogPage: "/dogs/:dog_id/:lastReportedId?",
    reportFound: "/report-found",
    reportLost: "/report-missing",
    searchLostDog: "/search-lost",
    searchFoundDog: "/search-found",
    results: "/results/:dogType/:lastReportedId?",
    allReports: "/all-reports/:dogType?",
  },
};
