import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const dataPath = resolve(process.argv[2] || 'src/data/scan-2026-05-20.json');
const data = JSON.parse(readFileSync(dataPath, 'utf8'));
const games = Array.isArray(data.all_games) ? data.all_games : [];

const allowedEmbedHosts = new Set([
  'html5.gamedistribution.com',
  'cloud.onlinegames.io',
  'www.onlinegames.io',
  'db.duckmath.org',
  'bloxd.io',
  'skribbl.io',
]);

function isAllowedEmbedUrl(embedUrl) {
  if (!embedUrl) return false;
  try {
    const url = new URL(embedUrl);
    const host = url.hostname.toLowerCase();
    if (host === 'itch.io') return url.pathname.startsWith('/embed/');
    if (host === 'www.crazygames.com') return url.pathname.startsWith('/embed/');
    if (host === 'www.onlinegames.io') return url.pathname.startsWith('/games/');
    return allowedEmbedHosts.has(host);
  } catch {
    return false;
  }
}

function decodeHtml(value) {
  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&ndash;/g, '-')
    .replace(/&mdash;/g, '-')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number.parseInt(dec, 10)));
}

function cleanText(value) {
  return decodeHtml(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function findContent(html) {
  const start = html.indexOf('<div class="gametext-container">');
  if (start === -1) return '';
  const end = html.indexOf('<figure class="post__featured-image"', start);
  return html.slice(start, end === -1 ? undefined : end);
}

function extractParagraphs(html) {
  return [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => cleanText(match[1]))
    .filter(Boolean);
}

function extractItems(html) {
  return [...html.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((match) => cleanText(match[1]).replace(/^[^\p{L}\p{N}]+/u, '').trim())
    .filter(Boolean);
}

function splitSections(content) {
  const headings = [...content.matchAll(/<h([23])\b[^>]*>([\s\S]*?)<\/h\1>/gi)];
  return headings.map((heading, index) => {
    const next = headings[index + 1];
    const body = content.slice(heading.index + heading[0].length, next?.index ?? content.length);
    return {
      title: cleanText(heading[2]),
      level: Number(heading[1]),
      paragraphs: extractParagraphs(body),
      items: extractItems(body),
    };
  });
}

function unique(values) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function normalizeDetails(game, html) {
  const content = findContent(html);
  if (!content) return null;

  const firstHeading = content.search(/<h[23]\b/i);
  const introHtml = firstHeading === -1 ? content : content.slice(0, firstHeading);
  const overview = extractParagraphs(introHtml)[0] || game.description || '';
  const sections = splitSections(content);

  const controls = [];
  const howToPlay = [];
  const tips = [];
  let developer = '';

  for (const section of sections) {
    const title = section.title.toLowerCase();
    if (title.includes('control')) {
      controls.push(...section.items, ...section.paragraphs);
    } else if (title.includes('tip') || title.includes('trick')) {
      tips.push(...section.items, ...section.paragraphs);
    } else if (title.includes('developer')) {
      developer = section.paragraphs.join(' ');
    } else if (title.includes('how to play') || section.level === 3) {
      howToPlay.push(...section.paragraphs, ...section.items);
    }
  }

  return {
    overview,
    controls: unique(controls).slice(0, 8),
    howToPlay: unique(howToPlay).slice(0, 8),
    tips: unique(tips).slice(0, 8),
    developer,
    sourceUrl: game.url,
  };
}

let enriched = 0;
let skipped = 0;

for (const game of games) {
  if (!isAllowedEmbedUrl(game.embed_url) || !game.url?.startsWith('https://www.onlinegames.io/')) {
    skipped += 1;
    continue;
  }

  const response = await fetch(game.url);
  if (!response.ok) {
    skipped += 1;
    continue;
  }

  const html = await response.text();
  const details = normalizeDetails(game, html);
  if (!details) {
    skipped += 1;
    continue;
  }

  game.details = details;
  enriched += 1;
}

writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
console.log(`Enriched ${enriched} games, skipped ${skipped}.`);
