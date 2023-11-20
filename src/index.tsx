import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";
import { App } from "./components/App";
import reportWebVitals from "./reportWebVitals";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const authDomain = process.env.REACT_APP_AUTH0_DOMAIN || "unknown";
const authClient = process.env.REACT_APP_AUTH0_CLIENT_ID || "unknonw";
const auth0Audience = process.env.REACT_APP_AUTH0_AUDIENCE || "";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <>
    <head>
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        property="og:image"
        content="https://lh3.googleusercontent.com/pw/ADCreHerQpnxPcwHMIhuG2siH-ZgRT7FRDEY2lffJseOCuHbJVoaUZxcSoZlsZmhdAABl16xQw1TWW1QtlQ-2LBANB1vPdaEr0aXQekg-H8MB5gY1eJMgQ=w2400"
      />
      <meta property="og:title" content="Fluffy-Finder" />
      <meta property="og:image:type" content="image/png" />
      <meta
        name="twitter:card"
        content="https://lh3.googleusercontent.com/pw/ADCreHdzzwSSrfQCrEbgyXU3l6EFPW_GqPflx_9Bd6jTrWcq1Vg8ex7U9ewd3EICr_6x08ii7TocGU0GPF4tQIXwZYbEkcfaJrucSVpYAXbL-SsO0tR5AQ=w2400"
      />
    </head>
    <Auth0Provider
      domain={authDomain}
      clientId={authClient}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: auth0Audience,
        scope: "read:dogs",
      }}
    >
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Auth0Provider>
    ,
  </>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
