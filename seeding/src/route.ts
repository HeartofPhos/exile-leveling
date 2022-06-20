import fs from "fs";
import readline from "readline";

type Action = string[];
type Step = (string | Action)[];

function parseStep(text: string) {
  const regex = /(\s*#.*)|([^{]+)|\{(.+?)\}/g;

  let steps: Step = [];

  const matches = text.matchAll(regex);
  for (const match of matches) {
    const commentMatch = match[1];
    if (commentMatch) continue;

    const textMatch = match[2];
    if (textMatch) {
      steps.push(textMatch);
    }

    const actionMatch = match[3];
    if (actionMatch) {
      const split = actionMatch.split("|");
      steps.push(split);
    }
  }

  return steps;
}

const actionValidators: Record<string, (action: Action) => boolean> = {
  kill: (action: Action) => action.length == 2,
  enter: (action: Action) => action.length == 2,
  town: (action: Action) => action.length == 1,
  waypoint: (action: Action) => action.length == 2,
  get_waypoint: (action: Action) => action.length == 1,
  set_portal: (action: Action) => action.length == 1,
  use_portal: (action: Action) => action.length == 1,
  area: (action: Action) => action.length == 2,
  quest: (action: Action) => action.length == 2,
  quest_item: (action: Action) => action.length == 2,
  vendor: (action: Action) => action.length == 1,
  trial: (action: Action) => action.length == 1,
};

function validateSteps(steps: Step[]) {
  for (const step of steps) {
    for (const subStep of step) {
      if (typeof subStep == "string") continue;
      if (subStep.length == 0) throw new Error(subStep.toString());

      const actionKey = subStep[0];
      const validator = actionValidators[actionKey];
      if (!validator) throw new Error(subStep.toString());

      const isValid = validator(subStep);
      if (!isValid) throw new Error(subStep.toString());
    }
  }
}

export async function parseRoute(routePath: string) {
  const fileStream = fs.createReadStream(routePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const steps: Step[] = [];
  for await (const line of rl) {
    if (!line) continue;

    let step = parseStep(line);
    if (step.length > 0) steps.push(step);
  }

  validateSteps(steps);

  console.log(steps);
}
