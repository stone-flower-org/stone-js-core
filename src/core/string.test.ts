import {
  doesIncludeCaseInsensitive,
  getDomainToLevel,
  joinNonEmpty,
  makeAbbreviature,
  pluralize,
  removeWordsFromString,
} from './string';

describe('makeAbbreviature', () => {
  it('should make abbreviature from strings array', () => {
    const words = ['Some', 'string'];
    expect(makeAbbreviature(words)).toBe('SS');
  });

  it('should filter nullable', () => {
    const words = ['Some', undefined, 'string'];
    expect(makeAbbreviature(words)).toBe('SS');
  });
});

describe('getDomainToLevel', () => {
  const domain = 'third-level.second-level.first-level';

  describe.each([
    {
      domain,
      level: 0,
      result: '',
    },
    {
      domain,
      level: 1,
      result: 'first-level',
    },
    {
      domain,
      level: 2,
      result: 'second-level.first-level',
    },
    {
      domain,
      level: 3,
      result: 'third-level.second-level.first-level',
    },
    {
      domain,
      level: 4,
      result: 'third-level.second-level.first-level',
    },
  ])('should return domain to given level', ({ domain, level, result }) => {
    it(`result: ${result}, domain: ${domain}, level: ${level}`, () => {
      expect(getDomainToLevel(domain, level)).toBe(result);
    });
  });

  it('should throw error when level less 0', () => {
    expect(() => getDomainToLevel(domain, -1)).toThrow('Level should be non less 0, -1 given');
  });
});

describe('pluralize', () => {
  describe.each([
    {
      word: 'apple',
      amount: 1,
      ending: 's',
      result: 'apple',
    },
    {
      word: 'apple',
      amount: 2,
      ending: 's',
      result: 'apples',
    },
  ])('should add ending when amount greater 1', ({ word, amount, ending, result }) => {
    it(`word: ${word}, amount: ${amount}, ending: ${ending}, result: ${result}`, () => {
      expect(pluralize(word, amount, ending)).toBe(result);
    });
  });
});

describe('joinNonEmpty', () => {
  describe.each([
    {
      words: ['Hello', 'World'],
      separator: ' ',
      result: 'Hello World',
    },
    {
      words: ['Hello', '', 'World'],
      separator: undefined,
      result: 'HelloWorld',
    },
    {
      words: ['Hello', '', 'World'],
      separator: ' ',
      result: 'Hello World',
    },
    {
      words: ['Hello', null, 'World'],
      separator: ' ',
      result: 'Hello World',
    },
    {
      words: ['Hello', undefined, 'World'],
      separator: ' ',
      result: 'Hello World',
    },
  ])('should join non empty strings with given separator', ({ words, separator, result }) => {
    it(`words: ${JSON.stringify(words)}, separator: "${String(separator)}", result: ${result}`, () => {
      expect(joinNonEmpty(words, separator)).toBe(result);
    });
  });
});

describe.each([
  {
    string: 'word1 word2 word3 word1',
    words: ['word'],
    separators: [' '],
    result: 'word1 word2 word3 word1',
  },
  {
    string: 'word1 word2 word3 word1',
    words: ['word1'],
    separators: [' '],
    result: 'word2 word3',
  },
  {
    string: 'word1 word2 word3 word1',
    words: ['word2', 'word3'],
    separators: [' '],
    result: 'word1 word1',
  },
  {
    string: 'word1,word2,word3,word1',
    words: ['word1'],
    separators: [','],
    result: 'word2,word3',
  },
])('removeWordsFromString', ({ string, words, separators, result }) => {
  describe('should remove given words from string divided by given separators', () => {
    it(`string: ${string}, words: ${JSON.stringify(words)}, separators: ${JSON.stringify(
      separators,
    )}, result: ${result}`, () => {
      expect(removeWordsFromString(string, words, separators)).toBe(result);
    });
  });
});

describe('doesIncludeCaseInsensitive', () => {
  describe.each([
    {
      string: 'include',
      part: 'include',
      result: true,
    },
    {
      string: 'include',
      part: 'Include',
      result: true,
    },
    {
      string: 'include',
      part: 'in',
      result: true,
    },
    {
      string: 'include',
      part: "doesn't include",
      result: false,
    },
  ])('should return true when part is substr of string', ({ string, part, result }) => {
    it(`string: ${string}, part: ${part}, result: ${String(result)}`, () => {
      expect(doesIncludeCaseInsensitive(string, part)).toBe(result);
    });
  });
});
