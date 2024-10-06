import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import ReactGA from "react-ga4";

export const initializeMonitoring = () => {
  // Initialize Sentry
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN, // Make sure to add this to your .env file
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
  });

  // Initialize Google Analytics
  ReactGA.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID); // Make sure to add this to your .env file
};

export const logPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

export const logEvent = (category, action, label) => {
  ReactGA.event({
    category: category,
    action: action,
    label: label,
  });
};