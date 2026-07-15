import { useAtom } from "jotai";
import { RouteEditor } from "../../components/RouteEditor";
import { routeFilesSelector } from "../../state/route-files";
import { RESET } from "jotai/utils";

export default function EditRouteContainer() {
  const [routeFiles, setRouteFiles] = useAtom(routeFilesSelector);

  return (
    <RouteEditor
      routeFiles={routeFiles}
      onSubmit={(routeFiles) => setRouteFiles(routeFiles)}
      onReset={() => setRouteFiles(RESET)}
    />
  );
}
