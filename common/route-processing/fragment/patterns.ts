import { RawFragment } from ".";

export interface Pattern {
  regex: RegExp;
  processor: (match: RegExpExecArray) => RawFragment | null;
}

export function matchPatterns(
  text: string,
  lastIndex: number,
  patterns: Pattern[]
) {
  for (const pattern of patterns) {
    pattern.regex.lastIndex = lastIndex;
    const match = pattern.regex.exec(text);

    if (match && match.index === lastIndex) {
      let rawFragment: RawFragment | null = null;
      if (pattern.processor) rawFragment = pattern.processor(match);

      return {
        lastIndex: pattern.regex.lastIndex,
        rawFragment: rawFragment,
      };
    }
  }

  return null;
}
