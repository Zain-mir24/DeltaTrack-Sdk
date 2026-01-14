import { sendEvent } from "./utils";

export function initErrorTracking() {
  window.onerror = function (message, source, lineno, colno, error) {
    sendEvent({
      type: "uncaught-error",
      message,
      source,
      lineno,
      colno,
      stack: error?.stack,
      timestamp: Date.now()
    });
  };

  window.onunhandledrejection = function (event) {
    sendEvent({
      type: "unhandled-rejection",
      message: event.reason?.message,
      stack: event.reason?.stack,
      timestamp: Date.now()
    });
  };
}

export function captureError(error) {
  sendEvent({
    type: "manual-error",
    message: error.message,
    stack: error.stack,
    timestamp: Date.now()
  });
}
