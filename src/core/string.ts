export const makeAbbreviature = (words: (string | undefined | null)[]) =>
  words.reduce<string>((result, word) => (result += (word?.at(0) ?? '').toUpperCase()), '');

export const joinNonEmpty = (words: (string | undefined | null)[], separator = '') =>
  words.filter((word) => word).join(separator);

export const pluralize = (word: string, amount: number, ending = 's'): string =>
  amount < 2 ? word : `${word}${ending}`;

export const getDomainToLevel = (domain: string, level: number) => {
  const domainParts = domain.split('.');
  if (level < 0) throw new Error(`Level should be non less 0, ${level} given`);
  if (level > domainParts.length) return domain;
  return domainParts.slice(domainParts.length - level, domainParts.length).join('.');
};

export const removeWordsFromString = (string: string, words: string[], separators: string[] = [' ']) => {
  const separator = separators.join('|');
  return string.replaceAll(
    new RegExp(words.map((word) => `(${word}(${separator})|(${separator})?${word}$)`).join('|'), 'g'),
    '',
  );
};

export const doesIncludeCaseInsensitive = (text: string, string: string) =>
  text.toUpperCase().includes(string.toUpperCase());
