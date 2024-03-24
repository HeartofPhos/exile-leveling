import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { createHashHistory } from "history";

export function loadAnalytics(connectionString: string) {
  const history = createHashHistory();
  const reactPlugin = new ReactPlugin();
  const appInsights = new ApplicationInsights({
    config: {
      connectionString,
      enableAutoRouteTracking: true,
      extensions: [reactPlugin],
      extensionConfig: {
        [reactPlugin.identifier]: { history },
      },
    },
  });
  appInsights.loadAppInsights();
}
