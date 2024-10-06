import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import ReactGA from "react-ga4";

export const initializeMonitoring = () => {
  // Initialize Sentry
  Sentry.init({
    dsn: "YOUR_SENTRY_DSN", // Replace with your actual Sentry DSN
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
  });

  // Initialize Google Analytics
  ReactGA.initialize("YOUR_GA_MEASUREMENT_ID"); // Replace with your GA4 Measurement ID
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