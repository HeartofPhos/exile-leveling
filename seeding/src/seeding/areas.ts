import { Areas } from "../../../common/types";
import { MapPinsDat, RecipeUnlockDisplayDat, WorldAreasDat } from "../../data";

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
      map_name: null,
      act: worldArea.Act,
      has_waypoint: worldArea.HasWaypoint,
      is_town_area: worldArea.IsTown,
      parent_town_area_id: worldArea.ParentTown_WorldAreasKey
        ? WorldAreasDat.data[worldArea.ParentTown_WorldAreasKey].Id
        : null,
      connection_ids: connected_area_ids,
      crafting_recipes: crafting_recipes,
    };
  }

  for (const mapPin of MapPinsDat.data) {
    if (mapPin.Waypoint_WorldAreasKey) {
      const worldArea = WorldAreasDat.data[mapPin.Waypoint_WorldAreasKey];
      const resultArea = result[worldArea.Id];
      if (!resultArea) continue;

      resultArea.map_name = mapPin.Name;
    }
  }

  return result;
}
