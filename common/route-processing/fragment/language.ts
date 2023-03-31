export namespace Language {
  export type Fragment =
    | "kill"
    | "arena"
    | "area"
    | "enter"
    | "logout"
    | "waypoint"
    | "waypoint_get"
    | "portal"
    | "quest"
    | "quest_text"
    | "generic"
    | "reward_quest"
    | "reward_vendor"
    | "trial"
    | "ascend"
    | "crafting"
    | "dir";

  export interface FragmentParameter {
    name: string;
    description: string;
  }

  export interface FragmentVariant {
    description: string;
    parameters: FragmentParameter[];
  }

  export const FragmentDescriptionLookup: Record<Fragment, FragmentVariant[]> =
    {
      ["kill"]: [
        {
          description:
            "Describe monsters to kill, certain monsters unlock waypoints on kill",
          parameters: [{ name: "text", description: "Text to display" }],
        },
      ],

      ["arena"]: [
        {
          description: "Describe sub-areas inside true areas",
          parameters: [{ name: "text", description: "Text to display" }],
        },
      ],
      ["area"]: [
        {
          description: "Lookup an area",
          parameters: [
            {
              name: "area_id",
              description: "Area Id used internally by Path Of Exile",
            },
          ],
        },
      ],
      ["enter"]: [
        {
          description: "Enter an area",
          parameters: [
            {
              name: "area_id",
              description: "Area Id used internally by Path Of Exile",
            },
          ],
        },
      ],
      ["logout"]: [
        {
          description:
            "Logout or Exit to Character Selection and re-enter, removes portals",
          parameters: [],
        },
      ],
      ["waypoint"]: [
        {
          description: "Describe a waypoint",
          parameters: [],
        },
        {
          description: "Use a waypoint",
          parameters: [
            {
              name: "area_id",
              description: "Area Id used internally by Path Of Exile",
            },
          ],
        },
      ],
      ["waypoint_get"]: [
        {
          description: "Unlocks the waypoint for the current zone",
          parameters: [],
        },
      ],
      ["portal"]: [
        {
          description: "Sets portal to the current area",
          parameters: [
            {
              name: "set",
              description: "keyword",
            },
          ],
        },
        {
          description:
            "Use the portal in the current area, places a portal if required",
          parameters: [
            {
              name: "use",
              description: "keyword",
            },
          ],
        },
      ],
      ["quest"]: [
        {
          description:
            "Hand in a quest and receive all reward offers, will generate gem steps based on build data",
          parameters: [
            {
              name: "quest_id",
              description: "Quest Id used internally by Path Of Exile",
            },
          ],
        },
        {
          description:
            "Hand in a quest and receive specified reward offer, will generate gem steps based on build data",
          parameters: [
            {
              name: "quest_id",
              description: "Quest Id used internally by Path Of Exile",
            },
            {
              name: "reward_offer_id",
              description: "Reward Offer Id used internally by Path Of Exile",
            },
          ],
        },
      ],
      ["quest_text"]: [
        {
          description: "Describe quest text",
          parameters: [{ name: "text", description: "Text to display" }],
        },
      ],
      ["generic"]: [
        {
          description: "Describe generic text",
          parameters: [{ name: "text", description: "Text to display" }],
        },
      ],
      ["reward_quest"]: [
        {
          description: "Describe quest rewards a player should take",
          parameters: [{ name: "text", description: "Text to display" }],
        },
      ],
      ["reward_vendor"]: [
        {
          description: "Describe vendor rewards a player should buy",
          parameters: [{ name: "text", description: "Text to display" }],
        },
      ],
      ["trial"]: [
        {
          description: "Complete the ascendancy trial in the current area",
          parameters: [],
        },
      ],
      ["ascend"]: [
        {
          description: "Complete The Lord's Labyrinth",
          parameters: [
            {
              name: "version",
              description:
                "Version to complete, normal/cruel/merciless/eternal",
            },
          ],
        },
      ],
      ["crafting"]: [
        {
          description: "Get the crafting recipe in the current area",
          parameters: [],
        },
      ],
      ["dir"]: [
        {
          description: "Describe a direction",
          parameters: [
            {
              name: "number",
              description: "Number of degrees in multiples of 45, where 0 = Up",
            },
          ],
        },
      ],
    };
}
