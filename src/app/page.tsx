import Link from "next/link";
import { categories, getAllGames, getCategoryGameCounts, getLatestGames } from "@/data/games";
import ClientSearchBox from "@/components/ClientSearchBox";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GameHub - 游戏导航站",
  description: "发现最好的免费在线游戏，分类浏览挂机、合成、生存、射击等热门游戏。",
};

export default function HomePage() {
  const allGames = getAllGames();
  const counts = getCategoryGameCounts();
  const latestGames = getLatestGames(12);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          发现好游戏
        </h1>
        <p className="mt-3 text-lg text-zinc-500">
          收录 <strong className="text-indigo-600">{allGames.length}</strong> 款免费在线游戏，一键直达
        </p>
        <div className="mx-auto mt-6 max-w-md">
          <ClientSearchBox />
        </div>
      </section>

      {/* Category Grid */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-zinc-800">游戏分类</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="group rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-md"
            >
              <h3 className="font-medium text-zinc-800 group-hover:text-indigo-600">
                {cat.name}
              </h3>
              <p className="mt-1 text-sm text-zinc-400">
                {counts[cat.slug] || 0} 款游戏
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Games */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-zinc-800">推荐游戏</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {latestGames.map((game) => (
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
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
