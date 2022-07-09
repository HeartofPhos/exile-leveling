import { Areas } from "../../../common/types";
import { WorldAreasDat } from "../../data";

export async function getAreas() {
  const result: Areas = {};

  // The Twilight Strand
  let todo = [2];
  let done = new Set<number>();

  let cnt = 0;
  while (todo.length > 0) {
    const worldAreas = todo.map((x) => WorldAreasDat.data[x]);

    for (const id of todo) {
      done.add(id);
    }
    todo.length = 0;

    for (const worldArea of worldAreas) {
      const connected_area_ids = [];

      for (const key of worldArea.Connections_WorldAreasKeys) {
        if (!done.has(key)) {
          todo.push(key);
        }
        const connectedWorldArea = WorldAreasDat.data[key];
        connected_area_ids.push(connectedWorldArea.Id);
      }

      result[worldArea.Id] = {
        id: worldArea.Id,
        name: worldArea.Name,
        act: worldArea.Act,
        has_waypoint: worldArea.HasWaypoint,
        is_town_area: worldArea.IsTown,
        connection_ids: connected_area_ids,
      };

      cnt++;
    }

    console.log(`Areas ${cnt}`);
  }

  return result;
}
