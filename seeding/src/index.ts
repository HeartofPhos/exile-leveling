import fs from "fs";
import { getAreas, getGems, getQuests } from "./seeding";
import {
  initializeRouteState,
  parseRoute,
  validateRoute,
} from "../../common/route";

const dataPath = process.argv[2];
function saveData(name: string, data: any) {
  fs.writeFileSync(`${dataPath}/${name}.json`, JSON.stringify(data, null, 2));
}
function loadData(name: string) {
  return JSON.parse(fs.readFileSync(`${dataPath}/${name}.json`, "utf-8"));
}

export async function main() {
  if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath, { recursive: true });

  const command = process.argv[3];
  switch (command) {
    case "seed-data":
      {
        const gems = await getGems();
        saveData("gems", gems);

        const quests = await getQuests();
        saveData("quests", quests);

        const areas = await getAreas();
        saveData("areas", areas);
      }
      break;
    case "validate-route":
      {
        const quests = loadData("quests");
        const areas = loadData("areas");
        const bossWaypoints = loadData("boss-waypoints");

        const routeData = fs.readFileSync(`${dataPath}/route.txt`, "utf-8");
        const route = parseRoute(routeData);
        const routeState = initializeRouteState(quests, areas, bossWaypoints);
        validateRoute(route, routeState);
      }
      break;
    default:
      {
        console.log(`Unrecognized command ${command}`);
      }
      break;
  }
}

main();
