import fs from "fs";
import {
  getAreas,
  getGems,
  getQuestRewards,
  getVendorRewards,
} from "./seeding";

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

  const gems = await getGems();
  persistData("gems", gems);

  const questRewards = await getQuestRewards();
  persistData("quest_rewards", questRewards);

  const vendorRewards = await getVendorRewards();
  persistData("vendor_rewards", vendorRewards);

  const areas = await getAreas();
  persistData("areas", areas);
}

main();
