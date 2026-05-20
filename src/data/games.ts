import { readFileSync, existsSync, readdirSync } from 'fs';
import path from 'path';

export interface Game {
  title: string;
  url: string;
  source: string;
  score: number;
  image: string;
  description: string;
  embed_url?: string;
  details?: {
    overview?: string;
    controls?: string[];
    howToPlay?: string[];
    tips?: string[];
    developer?: string;
    sourceUrl?: string;
  };
}

const EMBEDDABLE_HOSTS = new Set([
  'html5.gamedistribution.com',
  'cloud.onlinegames.io',
  'www.onlinegames.io',
  'db.duckmath.org',
  'bloxd.io',
  'skribbl.io',
]);

function isAllowedEmbedUrl(embedUrl: string | undefined): boolean {
  if (!embedUrl) return false;

  try {
    const url = new URL(embedUrl);
    const host = url.hostname.toLowerCase();

    if (host === 'itch.io') {
      return url.pathname.startsWith('/embed/');
    }

    if (host === 'www.crazygames.com') {
      return url.pathname.startsWith('/embed/');
    }

    if (host === 'www.onlinegames.io') {
      return url.pathname.startsWith('/games/');
    }

    return EMBEDDABLE_HOSTS.has(host);
  } catch {
    return false;
  }
}

export function isEmbeddableGame(game: Game): boolean {
  return isAllowedEmbedUrl(game.embed_url);
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  keywords: string[];
}

export const categories: Category[] = [
  { slug: 'idle', name: '挂机 / 放置', description: '无需持续操作，轻松挂机成长的放置类游戏', keywords: ['idle', 'tap', 'factory', 'incremental', 'production', 'earn', 'mine', 'dig', 'craft'] },
  { slug: 'merge', name: '合成 / 合并', description: '合并相同元素，解锁更强道具的合成类游戏', keywords: ['merge', 'combine', 'mix', 'fuse', 'blend'] },
  { slug: 'survivor', name: '生存 / 幸存者', description: '在敌潮中生存，升级技能和武器的生存挑战', keywords: ['survivor', 'survive', 'survival', 'rogue', 'horde', 'zombie', 'vampire'] },
  { slug: 'shooter', name: '射击', description: '瞄准射击，消灭敌人的爽快射击体验', keywords: ['shooter', 'shoot', 'gun', 'bullet', 'sniper', 'soldier', 'war'] },
  { slug: 'puzzle', name: '益智 / 解谜', description: '动脑思考，解开精巧谜题的益智游戏', keywords: ['puzzle', 'match', 'block', 'tetris', '2048', 'brain', 'quiz', 'word', 'memory', 'sudoku', 'find', 'spot'] },
  { slug: 'racing', name: '赛车 / 竞速', description: '极速狂飙，体验速度与激情的竞速游戏', keywords: ['race', 'racing', 'drive', 'drift', 'car', 'speed', 'turbo', 'wheels', 'bike', 'moto', 'stunt'] },
  { slug: 'simulator', name: '模拟', description: '模拟真实或奇幻场景的沉浸式模拟游戏', keywords: ['simulator', 'sim', 'virtual', 'life', 'world'] },
  { slug: 'rpg', name: '角色扮演', description: '扮演英雄角色，展开史诗冒险的RPG游戏', keywords: ['rpg', 'role', 'adventure', 'hero', 'quest', 'dungeon', 'warrior', 'magic', 'knight', 'sword'] },
  { slug: 'defense', name: '塔防 / 防守', description: '建造防御工事，抵御敌人进攻的策略游戏', keywords: ['defense', 'defence', 'defend', 'tower', 'fortress', 'base', 'shield', 'bastion'] },
  { slug: 'battle', name: '对战 / 格斗', description: '与对手或Boss对战，比拼技巧的格斗游戏', keywords: ['battle', 'fight', 'combat', 'arena', 'duel', 'warrior', 'brawl', 'clash', 'war', 'knockout'] },
  { slug: 'io', name: 'IO 多人', description: '在线多人竞技，与其他玩家实时对战', keywords: ['io'] },
  { slug: 'clicker', name: '点击器', description: '不断点击获取资源，享受数值成长的爽快感', keywords: ['clicker', 'tap', 'click', 'factory', 'earn', 'money', 'cash', 'bills', 'incremental', 'production'] },
  { slug: 'craft', name: '建造', description: '收集材料，打造工具和建筑的创造类游戏', keywords: ['craft', 'build', 'forge', 'create', 'diy', 'builder', 'design'] },
  { slug: 'arcade', name: '街机 / 休闲', description: '轻松上手，随时随地来一局的街机风格游戏', keywords: ['arcade', 'classic', 'retro', 'jump', 'run', 'ball', 'pong', 'snake', 'pinball', 'drift', 'punch', 'pixel'] },
  { slug: 'tycoon', name: '大亨 / 经营', description: '经营企业，赚取利润的商业模拟游戏', keywords: ['tycoon', 'business', 'empire', 'company', 'shop', 'store', 'restaurant', 'cafe', 'bakery', 'donut', 'pizza', 'hotel', 'fashion', 'farm', 'market', 'snack', 'perfect', 'design'] },
];

/** Get the latest scan JSON file path */
function getLatestScanPath(): string {
  const localDir = path.resolve('src/data');
  try {
    const files = readdirSync(localDir).filter(f => f.startsWith('scan-') && f.endsWith('.json'));
    if (files.length > 0) {
      files.sort().reverse();
      return path.join(localDir, files[0]);
    }
  } catch {
    // not found
  }
  return path.resolve('src/data/scan-2026-05-19.json');
}

function loadGames(): Game[] {
  const jsonPath = getLatestScanPath();
  try {
    if (existsSync(jsonPath)) {
      const raw = readFileSync(jsonPath, 'utf-8');
      const data = JSON.parse(raw);
      const games: Game[] = data.all_games || [];
      return games
        .filter(isEmbeddableGame)
        .sort((a: Game, b: Game) => b.score - a.score);
    }
  } catch (e) {
    console.warn('[games] Failed to load game data:', e);
  }
  return [];
}

const allGames: Game[] = loadGames();

export function getAllGames(): Game[] {
  return allGames;
}

export function getGameByTitle(title: string): Game | undefined {
  return allGames.find(
    (g) => g.title.toLowerCase() === decodeURIComponent(title).toLowerCase()
  );
}

export function searchGames(query: string): Game[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return allGames.filter((g) => g.title.toLowerCase().includes(q));
}

export function getGamesByCategory(categorySlug: string): Game[] {
  const cat = categories.find((c) => c.slug === categorySlug);
  if (!cat) return [];
  const keywords = cat.keywords;
  return allGames.filter((g) => {
    const t = g.title.toLowerCase();
    return keywords.some((kw) => t.includes(kw));
  });
}

export function getCategoryGameCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const cat of categories) {
    counts[cat.slug] = getGamesByCategory(cat.slug).length;
  }
  return counts;
}

export function getLatestGames(limit: number = 12): Game[] {
  return allGames.slice(0, limit);
}
