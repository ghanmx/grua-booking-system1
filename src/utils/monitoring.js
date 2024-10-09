import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import ReactGA from "react-ga4";

const MAX_ERROR_LENGTH = 1000; // Maximum length for error messages

export const initializeMonitoring = () => {
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
  if (sentryDsn && sentryDsn !== 'YOUR_SENTRY_DSN_HERE') {
    Sentry.init({
      dsn: sentryDsn,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 0.2, // Reduced from 1.0 to 0.2
      beforeSend(event) {
        // Truncate long error messages
        if (event.message && event.message.length > MAX_ERROR_LENGTH) {
          event.message = event.message.substring(0, MAX_ERROR_LENGTH) + '...';
        }
        // Remove potentially large objects from the extra data
        if (event.extra) {
          Object.keys(event.extra).forEach(key => {
            if (typeof event.extra[key] === 'object' && event.extra[key] !== null) {
              event.extra[key] = '[Object removed to reduce payload size]';
            }
          });
        }
        return event;
      },
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

export const logError = (error) => {
  if (Sentry.captureException) {
    // Truncate error message if it's too long
    const truncatedMessage = error.message && error.message.length > MAX_ERROR_LENGTH
      ? error.message.substring(0, MAX_ERROR_LENGTH) + '...'
      : error.message;

    Sentry.captureException(new Error(truncatedMessage), {
      extra: {
        originalError: '[Original error object removed to reduce payload size]'
      }
    });
  }
};