import { buildTemplates } from "./build-tree/index.js";
import { getAreas } from "./seeding/areas.js";
import { getCharacters } from "./seeding/characters.js";
import { getGems as seedGems } from "./seeding/gems.js";
import { getQuests } from "./seeding/quests.js";
import fs from "fs";

const dataPath = process.argv[2];

function saveJSON(name: string, data: any) {
  const folder = `${dataPath}/json`;
  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(`${folder}/${name}.json`, JSON.stringify(data, null, 2));
}

function saveTreeJSON(name: string, data: any) {
  const folder = `${dataPath}/tree`;
  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(`${folder}/${name}.json`, JSON.stringify(data));
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
    const characters = await getCharacters();
    saveJSON("characters", characters);
  },
  ["tree"]: async () => {
    const templates = await buildTemplates();
    for (const { version, skillTree } of templates) {
      saveTreeJSON(version, skillTree);
    }
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
