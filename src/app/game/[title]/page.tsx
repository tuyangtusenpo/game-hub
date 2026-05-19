import { notFound } from "next/navigation";
import Link from "next/link";
import { getGameByTitle, getAllGames, categories, getGamesByCategory } from "@/data/games";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ title: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { title } = await params;
  const game = getGameByTitle(title);
  if (!game) return { title: "游戏未找到 - GameHub" };
  return {
    title: `${game.title} - GameHub 游戏导航`,
    description: `${game.title} - 来自 ${game.source} 的免费在线游戏，信号分 ${game.score}，SERP ${game.serp_count}`,
  };
}

export default async function GameDetailPage({ params }: PageProps) {
  const { title } = await params;
  const game = getGameByTitle(title);
  if (!game) notFound();

  // Find which category this game belongs to
  const matchingCategories = categories.filter((cat) =>
    cat.keywords.some((kw) => game.title.toLowerCase().includes(kw))
  );

  // Get related games from the same categories
  const relatedGames = new Set<string>();
  for (const cat of matchingCategories) {
    const catGames = getGamesByCategory(cat.slug);
    for (const g of catGames) {
      if (g.title !== game.title) {
        relatedGames.add(g.title);
      }
    }
  }
  const related = getAllGames()
    .filter((g) => relatedGames.has(g.title))
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-zinc-400">
        <Link href="/" className="hover:text-indigo-600">首页</Link>
        <span className="mx-2">/</span>
        {matchingCategories.length > 0 && (
          <>
            <Link href={`/${matchingCategories[0].slug}`} className="hover:text-indigo-600">
              {matchingCategories[0].name}
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-zinc-700">{game.title}</span>
      </nav>

      {/* Game Detail Card */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
          {game.title}
        </h1>

        {/* Meta Tags */}
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
            {game.source}
          </span>
          {matchingCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-600 hover:bg-zinc-200"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-amber-50 p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{game.score}</div>
            <div className="mt-1 text-xs text-amber-500">信号分</div>
          </div>
          <div className="rounded-xl bg-blue-50 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{game.serp_count}</div>
            <div className="mt-1 text-xs text-blue-500">SERP 结果数</div>
          </div>
          <div className="rounded-xl bg-purple-50 p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{game.trends_peak}</div>
            <div className="mt-1 text-xs text-purple-500">趋势峰值</div>
          </div>
          <div className="rounded-xl bg-green-50 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {game.opportunity.toFixed(2)}
            </div>
            <div className="mt-1 text-xs text-green-500">机会指数</div>
          </div>
        </div>

        {/* Play Button */}
        {game.url ? (
          <a
            href={game.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:w-auto"
          >
            在 {game.source} 上玩
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        ) : (
          <div className="mt-6 rounded-xl bg-zinc-50 px-6 py-3 text-sm text-zinc-400">
            暂无直接游玩链接
          </div>
        )}

        {/* Source info */}
        <div className="mt-4 text-xs text-zinc-400">
          数据来源: {game.source} · 扫描日期: 2026-05-19
        </div>
      </div>

      {/* Related Games */}
      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold text-zinc-800">更多同类游戏</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {related.map((g) => (
              <Link
                key={g.title}
                href={`/game/${encodeURIComponent(g.title)}`}
                className="group rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-md"
              >
                <h3 className="font-medium text-zinc-800 group-hover:text-indigo-600 line-clamp-2 text-sm">
                  {g.title}
                </h3>
                <div className="mt-2 flex items-center justify-between text-xs text-zinc-400">
                  <span className="rounded bg-zinc-100 px-1.5 py-0.5">{g.source}</span>
                  <span className="font-semibold text-amber-500">{g.score}分</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
