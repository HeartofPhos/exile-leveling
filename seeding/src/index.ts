import fs from "fs";
import { getGems as seedGems } from "./seeding/gems";
import { getQuests } from "./seeding/quests";
import { getAreas } from "./seeding/areas";
import { buildSVG } from "./build-tree";

const dataPath = process.argv[2];

function saveJSON(name: string, data: any) {
  fs.writeFileSync(
    `${dataPath}/json/${name}.json`,
    JSON.stringify(data, null, 2)
  );
}

function saveTree(name: string, data: string) {
  fs.writeFileSync(`${dataPath}/tree/${name}.svg`, data);
}

const COMMAND_PROCESSORS: Record<string, () => Promise<any>> = {
  ["data"]: async () => {
    const { gems, vaalGemLookup, awakenedGemLookup } = await seedGems();
    saveJSON("gems", gems);
    saveJSON("vaal-gem-lookup", vaalGemLookup);
    saveJSON("awakened-gem-lookup", awakenedGemLookup);
    const quests = await getQuests();
    saveJSON("quests", quests);
    const areas = await getAreas();
    saveJSON("areas", areas);
  },
  ["tree"]: async () => {
    const svg = await buildSVG("3.19");
    saveTree("tree", svg);
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
