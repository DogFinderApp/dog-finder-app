import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./components/App";
import reportWebVitals from "./reportWebVitals";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Auth0Provider } from "@auth0/auth0-react";


const authDomain = process.env.REACT_APP_AUTH0_DOMAIN || "unknown";
const authClient = process.env.REACT_APP_AUTH0_CLIENT_ID || "unknonw";
const auth0Audience = process.env.REACT_APP_AUTH0_AUDIENCE || "";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
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
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
