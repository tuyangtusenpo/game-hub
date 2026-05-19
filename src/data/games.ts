import { readFileSync, existsSync, readdirSync } from 'fs';
import path from 'path';

export interface Game {
  title: string;
  url: string;
  source: string;
  score: number;
  trends_peak: number;
  trends_avg: number;
  serp_count: number;
  opportunity: number;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  keywords: string[];
}

export const categories: Category[] = [
  { slug: 'idle', name: '挂机 / 放置', description: '无需持续操作，轻松挂机成长的放置类游戏', keywords: ['idle', 'clicker', 'tap', 'factory', 'mining', 'craft', 'dig'] },
  { slug: 'merge', name: '合成 / 合并', description: '合并相同元素，解锁更强道具的合成类游戏', keywords: ['merge', 'combine', 'craft'] },
  { slug: 'survivor', name: '生存 / 幸存者', description: '在敌潮中生存，升级技能和武器的生存挑战', keywords: ['survivor', 'survive', 'survival', 'rogue', 'horde'] },
  { slug: 'shooter', name: '射击', description: '瞄准射击，消灭敌人的爽快射击体验', keywords: ['shooter', 'shoot', 'gun', 'bullet', 'sniper', 'war', 'battle'] },
  { slug: 'puzzle', name: '益智 / 解谜', description: '动脑思考，解开精巧谜题的益智游戏', keywords: ['puzzle', 'match', 'block', 'tetris', '2048', 'brain', 'quiz', 'word', 'memory'] },
  { slug: 'racing', name: '赛车 / 竞速', description: '极速狂飙，体验速度与激情的竞速游戏', keywords: ['race', 'racing', 'drive', 'drift', 'car', 'speed', 'turbo', 'wheels'] },
  { slug: 'simulator', name: '模拟 / 模拟器', description: '模拟真实或奇幻场景的沉浸式模拟游戏', keywords: ['simulator', 'sim', 'virtual'] },
  { slug: 'rpg', name: '角色扮演', description: '扮演英雄角色，展开史诗冒险的RPG游戏', keywords: ['rpg', 'role', 'adventure', 'hero', 'quest', 'dungeon', 'warrior', 'magic'] },
  { slug: 'defense', name: '塔防 / 防守', description: '建造防御工事，抵御敌人进攻的策略游戏', keywords: ['defense', 'defence', 'defend', 'tower', 'fortress', 'base', 'shield'] },
  { slug: 'battle', name: '对战 / 格斗', description: '与对手或Boss对战，比拼技巧的格斗游戏', keywords: ['battle', 'fight', 'combat', 'arena', 'duel', 'war', 'warrior'] },
  { slug: 'io', name: 'IO 多人', description: '在线多人竞技，与其他玩家实时对战', keywords: ['io'] },
  { slug: 'clicker', name: '点击器', description: '不断点击获取资源，享受数值成长的爽快感', keywords: ['clicker', 'tap', 'click'] },
  { slug: 'craft', name: '合成 / 建造', description: '收集材料，打造工具和建筑的创造类游戏', keywords: ['craft', 'build', 'forge', 'create', 'factory', 'diy'] },
  { slug: 'arcade', name: '街机 / 休闲', description: '轻松上手，随时随地来一局的街机风格游戏', keywords: ['arcade', 'classic', 'retro', 'jump', 'run', 'ball', 'pong', 'snake', 'pinball'] },
  { slug: 'tycoon', name: '大亨 / 经营', description: '经营企业，赚取利润的商业模拟游戏', keywords: ['tycoon', 'business', 'empire', 'company', 'shop', 'store'] },
];

/** Get the latest scan JSON file path */
function getLatestScanPath(): string {
  const dir = 'D:/code/web/game-radar';
  try {
    const files = readdirSync(dir).filter(f => f.startsWith('scan-') && f.endsWith('.json'));
    if (files.length > 0) {
      files.sort().reverse();
      return path.join(dir, files[0]);
    }
  } catch {
    // directory not found
  }
  return path.resolve(dir, 'scan-2026-05-19.json');
}

// Try loading game data from JSON
function loadGames(): Game[] {
  const jsonPath = getLatestScanPath();
  try {
    if (existsSync(jsonPath)) {
      const raw = readFileSync(jsonPath, 'utf-8');
      const data = JSON.parse(raw);
      const games: Game[] = data.all_games || [];
      games.sort((a: Game, b: Game) => b.score - a.score);
      return games;
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

export function getGamesByCategory(categorySlug: string): Game[] {
  const cat = categories.find((c) => c.slug === categorySlug);
  if (!cat) return [];
  const keywords = cat.keywords;
  return allGames.filter((g) => {
    const t = g.title.toLowerCase();
    return keywords.some((kw) => t.includes(kw));
  });
}

/** Get the count of games per category (for display on homepage) */
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
