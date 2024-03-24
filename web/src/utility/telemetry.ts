import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { createHashHistory } from "history";

const history = createHashHistory();
const reactPlugin = new ReactPlugin();
const appInsights = new ApplicationInsights({
  config: {
    connectionString: import.meta.env.VITE_ANALYTICS_KEY,
    enableAutoRouteTracking: true,
    extensions: [reactPlugin],
    extensionConfig: {
      [reactPlugin.identifier]: { history },
    },
  },
});

export function loadAnalytics() {
  if (import.meta.env.VITE_ANALYTICS_KEY) {
    appInsights.loadAppInsights();
  }
}

export function trackEvent(event: {
  name: string;
  properties?: Record<string, any>;
}) {
  reactPlugin.trackEvent(event);
}
