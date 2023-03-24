import { RouteEditor } from "../../components/RouteEditor";
import { routeFilesSelector } from "../../state/route-files";
import { useRecoilState, useResetRecoilState } from "recoil";

export default function EditRouteContainer() {
  const [routeFiles, setRouteFiles] = useRecoilState(routeFilesSelector);
  const resetRouteFiles = useResetRecoilState(routeFilesSelector);

  return (
    <RouteEditor
      routeFiles={routeFiles}
      onSubmit={(routeFiles) => setRouteFiles(routeFiles)}
      onReset={() => resetRouteFiles()}
    />
  );
}
