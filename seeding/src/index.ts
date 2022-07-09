import fs from "fs";
import { getGems } from "./seeding/gems";
import { getQuests } from "./seeding/quests";
import { getAreas } from "./seeding/areas";

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
        // console.time("gems")
        // const gems = await getGems();
        // saveData("gems", gems);
        // console.timeEnd("gems")

        // console.time("quests")
        // const quests = await getQuests();
        // saveData("quests", quests);
        // console.timeEnd("quests")

        console.time("areas")
        const areas = await getAreas();
        saveData("areas", areas);
        console.timeEnd("areas")
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
