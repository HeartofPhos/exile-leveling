import fs from "fs";
import { getGems as seedGems } from "./seeding/gems";
import { getQuests } from "./seeding/quests";
import { getAreas } from "./seeding/areas";
import { rebuildRouteWithIds } from "./route-ids";

const dataPath = process.argv[2];
function saveData(name: string, data: any) {
  fs.writeFileSync(`${dataPath}/${name}.json`, JSON.stringify(data, null, 2));
}

export async function main() {
  if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath, { recursive: true });

  const command = process.argv[3];
  switch (command) {
    case "seed-data":
      {
        const { gems, vaalGemLookup, awakenedGemLookup } = await seedGems();
        saveData("gems", gems);
        saveData("vaal-gem-lookup", vaalGemLookup);
        saveData("awakened-gem-lookup", awakenedGemLookup);
        const quests = await getQuests();
        saveData("quests", quests);
        const areas = await getAreas();
        saveData("areas", areas);
      }
      break;
    case "generate-route-ids":
      {
        const base = "../common/data";

        const routeFilePaths = [
          "./routes/act-1.txt",
          "./routes/act-2.txt",
          "./routes/act-3.txt",
          "./routes/act-4.txt",
          "./routes/act-5.txt",
          "./routes/act-6.txt",
          "./routes/act-7.txt",
          "./routes/act-8.txt",
          "./routes/act-9.txt",
          "./routes/act-10.txt",
        ];

        await fs.promises.mkdir(`./output/routes`, { recursive: true });

        const idSet = new Set<string>();
        for (const routeFilePath of routeFilePaths) {
          const routeSource = await fs.promises.readFile(
            `${base}/${routeFilePath}`,
            "utf-8"
          );

          const updateSource = rebuildRouteWithIds(routeSource, idSet, 6);

          await fs.promises.writeFile(`${base}/${routeFilePath}`, updateSource);
        }
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
