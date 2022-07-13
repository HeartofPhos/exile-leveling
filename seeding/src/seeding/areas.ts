import { Areas } from "../../../common/types";
import { RecipeUnlockDisplayDat, WorldAreasDat } from "../../data";

export async function getAreas() {
  const result: Areas = {};

  // The Twilight Strand
  // Aspirant's Trial
  // Cruel Aspirant's Trial
  // Merciless Aspirant's Trial
  let todo = [2, 519, 591, 663];
  let done = new Set<number>();

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
