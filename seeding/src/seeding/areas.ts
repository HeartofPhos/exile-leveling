import { Areas } from "../../../common/types";
import { RecipeUnlockDisplayDat, WorldAreasDat } from "../../data";

const seedAreaIds = [
  // The Twilight Strand
  "1_1_1",
  // Aspirant's Trial
  "1_Labyrinth_boss_3",
  // Cruel Aspirant's Trial
  "2_Labyrinth_boss_3",
  // Merciless Aspirant's Trial
  "3_Labyrinth_boss_3",
];

export async function getAreas() {
  const result: Areas = {};

  const todo = WorldAreasDat.data.reduce<number[]>((p, c, i) => {
    if (seedAreaIds.some((areaId) => areaId == c.Id)) p.push(i);
    return p;
  }, []);
  const done = new Set<number>();

  while (todo.length > 0) {
    const worldAreasKey = todo.shift()!;
    const worldArea = WorldAreasDat.data[worldAreasKey];
    done.add(worldAreasKey);

    const connected_area_ids = [];
    for (const key of worldArea.Connections_WorldAreasKeys) {
      if (!done.has(key)) {
        todo.push(key);
      }
      const connectedWorldArea = WorldAreasDat.data[key];
      connected_area_ids.push(connectedWorldArea.Id);
    }

    const crafting_recipes = [];
    for (const recipeUnlockDisplay of RecipeUnlockDisplayDat.data) {
      if (recipeUnlockDisplay.UnlockArea == worldAreasKey)
        crafting_recipes.push(recipeUnlockDisplay.Description);
    }

    result[worldArea.Id] = {
      id: worldArea.Id,
      name: worldArea.Name,
      act: worldArea.Act,
      has_waypoint: worldArea.HasWaypoint,
      is_town_area: worldArea.IsTown,
      connection_ids: connected_area_ids,
      crafting_recipes: crafting_recipes,
    };
  }

  return result;
}
