## Getting Started

- `npm i`
- `npm run dev -w web`

## Seeding

### Passive Tree

- `npm run seed tree -w seeding`

### General

- Find the list of required `dat` files in `seeding/data/index.ts`
- Use https://github.com/HeartofPhos/exile-export to get required `.dat.json` files
- `npm run seed data -w seeding`

### Route

I'm not currently taking PRs related to route changes, my intention is to keep the base route in line with current speed running strategies. Specifically some bosses are done out of order (Aberrath, Yugul, Vilentia) because they're significantly safer when overleveled and don't affect the actual speed of the run. In short, the default route is configured that way for a reason. 

Users are encourged to use the [Edit Route Tab](https://heartofphos.github.io/exile-leveling/#/edit-route) in the deployed app to update the route to their preferred playstyle.