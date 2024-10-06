import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import ReactGA from "react-ga4";

export const initializeMonitoring = () => {
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
  if (sentryDsn && sentryDsn !== 'YOUR_SENTRY_DSN_HERE') {
    Sentry.init({
      dsn: sentryDsn,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 1.0,
    });
  } else {
    console.warn('Sentry DSN is not properly configured. Sentry will not be initialized.');
  }

  const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'YOUR_GA_MEASUREMENT_ID_HERE') {
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