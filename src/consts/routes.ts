export const AppRoutes = {
  root: "/",
  privacyPolicy: "/PrivacyPolicy",
  about: "/about",
  dogs: {
    dogPage: "/dogs/:dog_id?",
    dogPageAuthenticated: "/dogs/:dog_id/authenticated",
    reportFound: "/report/found",
    reportLost: "/report/lost",
    searchFoundDog: "/search/found",
    searchLostDog: "/search/lost",
    results: "/results/:dogType",
    allReports: "/all-reports/:dogType",
    allReportsHamal: "/all-reports/hamal",
    allMatches: "/all-matches",
    redirect: "/dogs/redirect",
  },
} as const;
