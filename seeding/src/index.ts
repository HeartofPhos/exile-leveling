import fs from "fs";
import { getAreas, getGems, getQuests } from "./seeding";
import { parseRoute } from "./route";

const persistPath = process.argv[2];
function persistData(name: string, data: any) {
  fs.writeFileSync(
    `${persistPath}/${name}.json`,
    JSON.stringify(data, null, 2)
  );
}

export async function main() {
  if (!fs.existsSync(persistPath))
    fs.mkdirSync(persistPath, { recursive: true });

  const command = process.argv[3];
  switch (command) {
    case "seed_data":
      {
        const gems = await getGems();
        persistData("gems", gems);

        const quests = await getQuests();
        persistData("quests", quests);

        const areas = await getAreas();
        persistData("areas", areas);
      }
      break;
    case "parse_route":
      {
        await parseRoute(`${persistPath}/route.txt`);
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
