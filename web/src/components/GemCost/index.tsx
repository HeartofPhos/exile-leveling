import { GameData } from "../../../../common/types";

interface GemCostProps {
  gem: GameData.Gem;
}

export function GemCost({ gem }: GemCostProps) {
  return (
    <img src={getImageUrl(`${getGemCost(gem.required_level)}.png`)} alt="" />
  );
}

function getGemCost(required_level: number) {
  if (required_level < 8) return "wisdom";
  if (required_level < 16) return "transmutation";
  if (required_level < 28) return "alteration";
  if (required_level < 38) return "chance";
  return "alchemy";
}

function getImageUrl(path: string) {
  return new URL(`./images/${path}`, import.meta.url).href;
}
