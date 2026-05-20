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
    title: `${cat.name} - GameHub 免费在线游戏`,
    description: cat.description,
  };
}

function GameCard({ game }: { game: { title: string; image?: string } }) {
  return (
    <Link
      href={`/game/${encodeURIComponent(game.title)}`}
      className="group rounded-xl border border-zinc-200 bg-white overflow-hidden transition hover:border-indigo-300 hover:shadow-md"
    >
      <div className="aspect-video bg-zinc-100 overflow-hidden relative">
        {game.image ? (
          <img
            src={game.image}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-indigo-100 to-purple-100">
            <span className="text-3xl">🎮</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-zinc-800 group-hover:text-indigo-600 line-clamp-2 text-sm leading-snug">
          {game.title}
        </h3>
      </div>
    </Link>
  );
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

      {/* Category nav for quick switching */}
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
            <GameCard key={game.title} game={game} />
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
