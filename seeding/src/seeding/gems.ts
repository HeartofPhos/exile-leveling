import { Gem } from "../../../common/types";
import { cargoQuery } from "../wiki";

function getGemCost(required_level: number) {
  if (required_level < 8) return "CurrencyIdentification";
  if (required_level < 16) return "CurrencyUpgradeToMagic";
  if (required_level < 28) return "CurrencyRerollMagic";
  if (required_level < 38) return "CurrencyUpgradeRandomly";
  return "CurrencyUpgradeToRare";
}

export async function getGems() {
  const queryResult = await cargoQuery({
    tables: ["items", "skill_gems"],
    join_on: ["items._pageName = skill_gems._pageName"],
    fields: [
      "items._pageName = page",
      "items.metadata_id = metadata_id",
      "items.inventory_icon = inventory_icon",
      "items.required_level = required_level",
      "skill_gems.primary_attribute = primary_attribute",
    ],
    where:
      '(items.tags HOLDS "gem") AND (NOT items._pageName LIKE "Template:%") AND (items.metadata_id IS NOT NULL)',
    order_by: ["items._pageName"],
  });

  const result: Record<Gem["id"], Gem> = {};
  for (const item of queryResult) {
    const required_level = Number(item.required_level);

    result[item.metadata_id] = {
      id: item.metadata_id,
      name: item.page,
      primary_attribute: item.primary_attribute,
      required_level: required_level,
      cost: getGemCost(required_level),
    };
  }

  return result;
}
