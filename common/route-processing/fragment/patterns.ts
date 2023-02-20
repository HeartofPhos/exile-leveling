export interface Pattern<T> {
  regex: RegExp;
  processor: (match: RegExpExecArray) => T | null;
}

export function matchAll<T>(
  text: string,
  patterns: Pattern<T>[],
  onMatch: (value: T | null) => void
) {
  text = text.trim();

  let currentIndex = 0;
  do {
    const matchResult = matchPatterns<T>(text, currentIndex, patterns);

    if (matchResult) {
      currentIndex = matchResult.lastIndex;
      onMatch(matchResult.processed);
    } else {
      return false;
    }
  } while (currentIndex < text.length);

  return true;
}

function matchPatterns<T>(
  text: string,
  lastIndex: number,
  patterns: Pattern<T>[]
) {
  for (const pattern of patterns) {
    pattern.regex.lastIndex = lastIndex;
    const match = pattern.regex.exec(text);

    if (match && match.index === lastIndex) {
      let processed: T | null = null;
      if (pattern.processor) processed = pattern.processor(match);

      return {
        lastIndex: pattern.regex.lastIndex,
        processed: processed,
      };
    }
  }

  return null;
}
