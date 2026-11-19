export type AvatarPattern = 'bauhaus' | 'rings' | 'prism' | 'split' | 'orbit';

export interface AvatarConfig {
  seed: string;
  bgColor: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  pattern: AvatarPattern;
  rotation: number;
  shiftX: number;
  shiftY: number;
}

const BACKGROUNDS = [
  '#1a1f29',
  '#221924',
  '#162426',
  '#261b17',
  '#1c202e',
  '#23201b',
];

const SHAPE_PALETTES: [string, string, string][] = [
  ['#ff6b35', '#ffb86b', '#ffdbd0'],
  ['#dd034e', '#ffb2ba', '#ffd9dc'],
  ['#ffb86b', '#38bdf8', '#dfe2eb'],
  ['#ff6b35', '#a78bfa', '#ffdcbc'],
  ['#34d399', '#ffb86b', '#ecfdf5'],
  ['#f472b6', '#fb923c', '#fff1f1'],
  ['#60a5fa', '#dd034e', '#ffd9dc'],
  ['#fbbf24', '#f87171', '#ffdbd0'],
];

const PATTERNS: AvatarPattern[] = ['bauhaus', 'rings', 'prism', 'split', 'orbit'];

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function createPrng(seedNum: number): () => number {
  let state = seedNum || 123456789;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generates a unique abstract geometric avatar configuration.
 * When called without a seed, creates a fresh randomized seed each time.
 */
export function generateUniqueAvatar(explicitSeed?: string): AvatarConfig {
  const randomSeed =
    explicitSeed ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.floor(Math.random() * 1e9)}`;

  const rand = createPrng(hashString(randomSeed));

  const bgColor = BACKGROUNDS[Math.floor(rand() * BACKGROUNDS.length)];
  const palette = SHAPE_PALETTES[Math.floor(rand() * SHAPE_PALETTES.length)];
  const pattern = PATTERNS[Math.floor(rand() * PATTERNS.length)];

  // Permute palette order randomly for more variety
  const indices = [0, 1, 2];
  for (let i = indices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  return {
    seed: randomSeed,
    bgColor,
    primaryColor: palette[indices[0]],
    secondaryColor: palette[indices[1]],
    accentColor: palette[indices[2]],
    pattern,
    rotation: Math.floor(rand() * 360),
    shiftX: Math.round((rand() - 0.5) * 10),
    shiftY: Math.round((rand() - 0.5) * 10),
  };
}
