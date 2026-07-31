/**
 * « Cascade » : des blocs numérotés descendent en continu. Il faut cliquer
 * ceux qui vérifient la règle affichée avant qu'ils ne sortent par le bas.
 *
 * Tout l'état tient dans un objet immuable avancé par `advance(state, dt)`,
 * sans dépendance à React : la boucle de rendu se contente d'appeler cette
 * fonction à chaque image.
 */

export type CascadeRule = {
  id: string;
  label: string;
  test: (value: number) => boolean;
};

function isPrime(value: number): boolean {
  if (value < 2) return false;
  if (value % 2 === 0) return value === 2;
  for (let d = 3; d * d <= value; d += 2) {
    if (value % d === 0) return false;
  }
  return true;
}

export const CASCADE_RULES: CascadeRule[] = [
  { id: "pairs", label: "les nombres pairs", test: (n) => n % 2 === 0 },
  { id: "impairs", label: "les nombres impairs", test: (n) => n % 2 === 1 },
  { id: "mult3", label: "les multiples de 3", test: (n) => n % 3 === 0 },
  { id: "mult4", label: "les multiples de 4", test: (n) => n % 4 === 0 },
  { id: "mult5", label: "les multiples de 5", test: (n) => n % 5 === 0 },
  { id: "premiers", label: "les nombres premiers", test: isPrime },
  {
    id: "carres",
    label: "les carrés parfaits",
    test: (n) => Number.isInteger(Math.sqrt(n)),
  },
];

/** Couleurs fluo des blocs, référencées depuis la feuille de style. */
export const CASCADE_NEON = [
  "var(--neon-cyan)",
  "var(--neon-magenta)",
  "var(--neon-green)",
  "var(--neon-yellow)",
  "var(--neon-orange)",
  "var(--neon-violet)",
  "var(--neon-lime)",
];

export const CASCADE_LANES = 5;
export const CASCADE_LIVES = 3;

const VALUE_MIN = 1;
const VALUE_MAX = 99;

/** Vitesse en « hauteurs d'aire de jeu par seconde ». */
const SPEED_START = 0.16;
const SPEED_GAIN = 0.005;
const SPEED_MAX = 0.5;

const SPAWN_START = 0.95;
const SPAWN_MIN = 0.4;
const SPAWN_GAIN = 0.008;

const RULE_DURATION = 14;
const POP_DURATION = 0.45;

/**
 * Une part fixe des blocs vérifie la règle en cours. Sans ce biais, une règle
 * rare (les carrés parfaits) ne produirait presque rien à cliquer.
 */
const MATCH_RATIO = 0.45;

const ALL_VALUES = Array.from(
  { length: VALUE_MAX - VALUE_MIN + 1 },
  (_, i) => VALUE_MIN + i,
);

/** Valeurs vérifiant / ne vérifiant pas chaque règle, calculées une fois. */
const VALUE_POOLS = CASCADE_RULES.map((rule) => ({
  matching: ALL_VALUES.filter((value) => rule.test(value)),
  other: ALL_VALUES.filter((value) => !rule.test(value)),
}));

export type CascadeBlock = {
  id: number;
  lane: number;
  /** 0 en haut de l'aire de jeu, 1 juste sorti par le bas. */
  y: number;
  value: number;
  neon: number;
};

export type CascadePop = {
  id: number;
  lane: number;
  y: number;
  tone: "good" | "bad";
  /** Va de 1 à 0 sur la durée de l'animation. */
  life: number;
};

export type CascadeState = {
  blocks: CascadeBlock[];
  pops: CascadePop[];
  nextId: number;
  score: number;
  combo: number;
  bestCombo: number;
  lives: number;
  elapsed: number;
  ruleIndex: number;
  ruleTimer: number;
  spawnTimer: number;
};

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function createCascadeState(): CascadeState {
  return {
    blocks: [],
    pops: [],
    nextId: 1,
    score: 0,
    combo: 0,
    bestCombo: 0,
    lives: CASCADE_LIVES,
    elapsed: 0,
    ruleIndex: 0,
    ruleTimer: RULE_DURATION,
    spawnTimer: 0.3,
    };
}

export function currentRule(state: CascadeState): CascadeRule {
  return CASCADE_RULES[state.ruleIndex];
}

export function currentSpeed(state: CascadeState): number {
  return Math.min(SPEED_MAX, SPEED_START + state.elapsed * SPEED_GAIN);
}

export function ruleProgress(state: CascadeState): number {
  return state.ruleTimer / RULE_DURATION;
}

export function isOver(state: CascadeState): boolean {
  return state.lives <= 0;
}

function spawnBlock(state: CascadeState): CascadeState {
  const pool = VALUE_POOLS[state.ruleIndex];
  const wantMatch = Math.random() < MATCH_RATIO;
  const value = pick(wantMatch ? pool.matching : pool.other);

  // On évite d'empiler deux blocs dans la même colonne en haut de l'aire.
  const busy = new Set(
    state.blocks.filter((block) => block.y < 0.22).map((block) => block.lane),
  );
  const free = Array.from({ length: CASCADE_LANES }, (_, i) => i).filter(
    (lane) => !busy.has(lane),
  );
  if (free.length === 0) return state;

  const block: CascadeBlock = {
    id: state.nextId,
    lane: pick(free),
    y: -0.18,
    value,
    neon: Math.floor(Math.random() * CASCADE_NEON.length),
  };

  return { ...state, blocks: [...state.blocks, block], nextId: state.nextId + 1 };
}

/** Avance la simulation de `dt` secondes. */
export function advance(state: CascadeState, dt: number): CascadeState {
  const rule = currentRule(state);
  const speed = currentSpeed(state);

  let lives = state.lives;
  let combo = state.combo;
  let nextId = state.nextId;
  const blocks: CascadeBlock[] = [];
  const pops: CascadePop[] = [];

  for (const pop of state.pops) {
    const life = pop.life - dt / POP_DURATION;
    if (life > 0) pops.push({ ...pop, life });
  }

  for (const block of state.blocks) {
    const y = block.y + speed * dt;
    if (y <= 1) {
      blocks.push({ ...block, y });
      continue;
    }
    // Sorti par le bas : seul un bloc qu'il fallait cliquer coûte une vie.
    if (rule.test(block.value)) {
      lives -= 1;
      combo = 0;
      pops.push({
        id: nextId++,
        lane: block.lane,
        y: 0.94,
        tone: "bad",
        life: 1,
      });
    }
  }

  let next: CascadeState = {
    ...state,
    blocks,
    pops,
    nextId,
    lives,
    combo,
    elapsed: state.elapsed + dt,
    ruleTimer: state.ruleTimer - dt,
    spawnTimer: state.spawnTimer - dt,
  };

  if (next.ruleTimer <= 0) {
    // Règle suivante, jamais la même deux fois de suite.
    const offset = 1 + Math.floor(Math.random() * (CASCADE_RULES.length - 1));
    next = {
      ...next,
      ruleIndex: (next.ruleIndex + offset) % CASCADE_RULES.length,
      ruleTimer: RULE_DURATION,
    };
  }

  const interval = Math.max(
    SPAWN_MIN,
    SPAWN_START - next.elapsed * SPAWN_GAIN,
  );
  // `while` plutôt que `if` : une image longue peut valoir plusieurs blocs.
  while (next.spawnTimer <= 0) {
    next = spawnBlock(next);
    next = { ...next, spawnTimer: next.spawnTimer + interval };
  }

  return next;
}

/** Traite un clic sur un bloc. */
export function hitBlock(state: CascadeState, blockId: number): CascadeState {
  const block = state.blocks.find((candidate) => candidate.id === blockId);
  if (!block) return state;

  const matched = currentRule(state).test(block.value);
  const combo = matched ? state.combo + 1 : 0;

  return {
    ...state,
    blocks: state.blocks.filter((candidate) => candidate.id !== blockId),
    pops: [
      ...state.pops,
      {
        id: state.nextId,
        lane: block.lane,
        y: block.y,
        tone: matched ? "good" : "bad",
        life: 1,
      },
    ],
    nextId: state.nextId + 1,
    // Le combo récompense les séries : chaque bloc enchaîné vaut plus cher.
    score: matched ? state.score + 10 + state.combo * 2 : state.score,
    combo,
    bestCombo: Math.max(state.bestCombo, combo),
    lives: matched ? state.lives : state.lives - 1,
  };
}
