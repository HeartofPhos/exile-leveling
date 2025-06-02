import { GameData } from "../../../common/types";
import { Dat } from "../data";

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
  const result: GameData.Areas = {};

  const todo = Dat.WorldAreas.data.reduce<number[]>((p, c, i) => {
    if (seedAreaIds.some((areaId) => areaId == c.Id)) p.push(i);
    return p;
  }, []);
  const done = new Set<number>();

  while (todo.length > 0) {
    const worldAreasKey = todo.shift()!;
    const worldArea = Dat.WorldAreas.data[worldAreasKey];
    done.add(worldAreasKey);

    const connected_area_ids = [];
    for (const key of worldArea.Connections_WorldAreasKeys) {
      if (!done.has(key)) {
        todo.push(key);
      }
      const connectedWorldArea = Dat.WorldAreas.data[key];
      connected_area_ids.push(connectedWorldArea.Id);
    }

    const crafting_recipes = [];
    for (const recipeUnlockDisplay of Dat.RecipeUnlockDisplay.data) {
      if (recipeUnlockDisplay.UnlockArea == worldAreasKey)
        crafting_recipes.push(recipeUnlockDisplay.Description);
    }

    result[worldArea.Id] = {
      id: worldArea.Id,
      name: worldArea.Name,
      map_name: null,
      act: worldArea.Act,
      level: worldArea.AreaLevel,
      has_waypoint: worldArea.HasWaypoint,
      is_town_area: worldArea.IsTown,
      parent_town_area_id: worldArea.ParentTown_WorldAreasKey
        ? Dat.WorldAreas.data[worldArea.ParentTown_WorldAreasKey].Id
        : null,
      connection_ids: connected_area_ids,
      crafting_recipes: crafting_recipes,
    };
  }

  for (const mapPin of Dat.MapPins.data) {
    if (mapPin.Waypoint_WorldAreasKey) {
      const worldArea = Dat.WorldAreas.data[mapPin.Waypoint_WorldAreasKey];
      const resultArea = result[worldArea.Id];
      if (!resultArea) continue;

      resultArea.map_name = mapPin.Name;
    }
  }

  return result;
}
