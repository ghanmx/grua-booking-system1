import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import ReactGA from "react-ga4";

export const initializeMonitoring = () => {
  // Initialize Sentry
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
  });

  // Initialize Google Analytics
  const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (GA_MEASUREMENT_ID) {
    ReactGA.initialize(GA_MEASUREMENT_ID);
  } else {
    console.warn('Google Analytics Measurement ID is not set. GA will not be initialized.');
  }
};

export const logPageView = (path) => {
  if (ReactGA.isInitialized) {
    ReactGA.send({ hitType: "pageview", page: path });
  }
};

export const logEvent = (category, action, label) => {
  if (ReactGA.isInitialized) {
    ReactGA.event({
      category: category,
      action: action,
      label: label,
    });
  }
};