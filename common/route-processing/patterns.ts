export interface Pattern<T> {
  regex: RegExp;
  processor: (match: RegExpExecArray, context: T) => boolean;
}

export function matchPatterns<T>(
  text: string,
  patterns: Pattern<T>[],
  context: T
) {
  text = text.trim();

  let currentIndex = 0;
  do {
    const lastIndex = matchAny<T>(text, currentIndex, patterns, context);

    if (lastIndex !== null) {
      currentIndex = lastIndex;
    } else {
      return false;
    }
  } while (currentIndex < text.length);

  return true;
}

function matchAny<T>(
  text: string,
  lastIndex: number,
  patterns: Pattern<T>[],
  context: T
) {
  for (const pattern of patterns) {
    pattern.regex.lastIndex = lastIndex;
    const match = pattern.regex.exec(text);

    if (match && match.index === lastIndex) {
      const continueParsing = pattern.processor(match, context);
      if (!continueParsing) return null;

      return pattern.regex.lastIndex;
    }
  }

  return null;
}
