import { getProjectKey } from "./state";
import { INGEST_URL } from "./config";

export function sendEvent(payload) {
  const projectKey = getProjectKey();

  if (!projectKey) {
    console.warn("[SDK] projectKey missing, dropping event");
    return;
  }

  fetch(INGEST_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-project-key": projectKey
    },
    body: JSON.stringify(payload)
  }).catch(() => {});
}

// Alias for backwards-compatibility with other modules that import
// `sendToBackend` (network.js and performance.js expect this name).
export const sendToBackend = sendEvent;
