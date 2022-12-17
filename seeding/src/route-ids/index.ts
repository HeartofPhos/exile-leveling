const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const charactersLength = characters.length;

function generateId(length: number) {
  let result = "";

  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export function rebuildRouteWithIds(
  routeSource: string,
  idSet: Set<string>,
  idLength: number
) {
  const routeLines = routeSource.split(/(?:\r\n|\r|\n)/g);

  const updatedLines = [];
  for (let line of routeLines) {
    const endifRegex = /^\s*#endif/g;
    const endifMatch = endifRegex.exec(line);
    if (endifMatch) {
      updatedLines.push(line);
      continue;
    }

    const ifdefRegex = /^\s*#ifdef\s+(\w+)/g;
    const ifdefMatch = ifdefRegex.exec(line);
    if (ifdefMatch) {
      updatedLines.push(line);
      continue;
    }

    let id;
    do {
      id = generateId(idLength);
    } while (idSet.has(id));
    idSet.add(id);

    const lineRegex = /(^\s*)(.+)/;
    const lineMatch = lineRegex.exec(line);

    if (lineMatch) {
      updatedLines.push(`${lineMatch[1]}step-${id}: ${lineMatch[2]}`);
    }
  }

  const updatedSource = updatedLines.join("\n") + "\n";
  return updatedSource;
}
