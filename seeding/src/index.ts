import fs from "fs";
import { getGems as seedGems } from "./seeding/gems";
import { getQuests } from "./seeding/quests";
import { getAreas } from "./seeding/areas";
import { parsePassiveTree } from "./skill-tree";

const dataPath = process.argv[2];
function saveData(name: string, data: any) {
  fs.writeFileSync(`${dataPath}/${name}.json`, JSON.stringify(data, null, 2));
}

const COMMAND_PROCESSORS: Record<string, () => Promise<any>> = {
  ["data"]: async () => {
    const { gems, vaalGemLookup, awakenedGemLookup } = await seedGems();
    saveData("gems", gems);
    saveData("vaal-gem-lookup", vaalGemLookup);
    saveData("awakened-gem-lookup", awakenedGemLookup);
    const quests = await getQuests();
    saveData("quests", quests);
    const areas = await getAreas();
    saveData("areas", areas);
  },
  ["tree"]: async () => {
    await parsePassiveTree("3.20");
  },
};

export async function main() {
  if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath, { recursive: true });

  const command = process.argv[3];
  const processor = COMMAND_PROCESSORS[command];
  if (processor) await processor();
  else console.log(`Unrecognized command ${command}`);
}

main();
