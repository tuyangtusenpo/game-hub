import { notFound } from "next/navigation";
import Link from "next/link";
import { categories, getGamesByCategory, getCategoryGameCounts } from "@/data/games";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const cat = categories.find((c) => c.slug === category);
  if (!cat) return { title: "分类未找到 - GameHub" };
  return {
    title: `${cat.name} - GameHub 游戏导航`,
    description: cat.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const cat = categories.find((c) => c.slug === category);
  if (!cat) notFound();

  const games = getGamesByCategory(category);
  const counts = getCategoryGameCounts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-zinc-400">
        <Link href="/" className="hover:text-indigo-600">首页</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-700">{cat.name}</span>
      </nav>

      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">{cat.name}</h1>
        <p className="mt-1 text-zinc-500">{cat.description}</p>
        <p className="mt-1 text-sm text-zinc-400">
          共 {games.length} 款游戏
        </p>
      </div>

      {/* Category list for quick switching */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/${c.slug}`}
            className={`rounded-full px-3 py-1 text-sm transition ${
              c.slug === category
                ? "bg-indigo-600 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {c.name} ({counts[c.slug] || 0})
          </Link>
        ))}
      </div>

      {/* Game Grid */}
      {games.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {games.map((game) => (
            <Link
              key={game.title}
              href={`/game/${encodeURIComponent(game.title)}`}
              className="group rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-md"
            >
              <h3 className="font-medium text-zinc-800 group-hover:text-indigo-600 line-clamp-2">
                {game.title}
              </h3>
              <div className="mt-2 flex items-center justify-between text-xs text-zinc-400">
                <span className="rounded bg-zinc-100 px-1.5 py-0.5">
                  {game.source}
                </span>
                <span className="font-semibold text-amber-500">
                  {game.score}分
                </span>
              </div>
              <div className="mt-2 text-xs text-zinc-400">
                SERP: {game.serp_count}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center text-zinc-400">
          该分类暂无游戏数据
        </div>
      )}
    </div>
  );
}
