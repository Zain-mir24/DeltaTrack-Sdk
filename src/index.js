import { initErrorTracking, captureError } from "./error";
import { setProjectKey } from "./state";
import {captureNetworkEvents} from "./network";
export function init({ projectKey }) {
  if (!projectKey) {
    console.warn("[WebMonitoringSDK] projectKey is required");
    return;
  }

  setProjectKey(projectKey);
  initErrorTracking();
}

export { captureError};
export { captureNetworkEvents };