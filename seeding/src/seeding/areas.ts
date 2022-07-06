import { cargoQuery } from "../wiki";
import { Area, Monster } from "../../../common/types";

export async function getAreas() {
  const result: Record<Area["id"], Area> = {};

  let done = new Set<string>();
  let todo = ["1_1_1"];

  let cnt = 0;
  while (todo.length > 0) {
    const areaQueryResult = await cargoQuery({
      tables: ["areas"],
      fields: [
        "id",
        "name",
        "act",
        "has_waypoint=has_waypoint",
        "is_town_area=is_town_area",
        "connection_ids=connection_ids",
        "boss_monster_ids=boss_monster_ids",
      ],
      where: `id IN (${todo.map((x) => `"${x}"`).join(",")})`,
    });

    for (const id of todo) {
      done.add(id);
    }
    todo.length = 0;

    for (const area of areaQueryResult) {
      let connection_ids: string[];
      if (area.connection_ids) {
        connection_ids = area.connection_ids.split(",");
        for (const connection_id of connection_ids) {
          if (!done.has(connection_id)) {
            todo.push(connection_id);
          }
        }
      } else {
        connection_ids = [];
      }

      let bosses: Monster[];
      if (area.boss_monster_ids) {
        const boss_monster_ids: string[] = area.boss_monster_ids.split(",");
        const monsterQueryResult = await cargoQuery({
          tables: ["monsters"],
          fields: ["metadata_id=metadata_id", "name"],
          where: `metadata_id IN (${boss_monster_ids
            .map((x) => `"${x}"`)
            .join(",")})`,
        });

        bosses = monsterQueryResult.map((x) => ({
          metadata_id: x.metadata_id,
          name: x.name,
        }));
      } else {
        bosses = [];
      }

      result[area.id] = {
        id: area.id,
        name: area.name,
        act: area.act,
        has_waypoint: area.has_waypoint == "1",
        is_town_area: area.is_town_area == "1",
        connection_ids: connection_ids,
        bosses: bosses,
      };

      cnt++;
    }

    console.log(`Areas ${cnt}`);
  }

  return result;
}
