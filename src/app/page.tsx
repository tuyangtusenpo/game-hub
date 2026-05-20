import Link from "next/link";
import { categories, getAllGames, getCategoryGameCounts, getLatestGames } from "@/data/games";
import ClientSearchBox from "@/components/ClientSearchBox";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GameHub - 免费在线游戏导航",
  description: "发现最好的免费在线游戏，分类浏览挂机、合成、生存、射击等热门游戏，在线畅玩。",
};

function GameCard({ game }: { game: { title: string; image?: string; url: string; source: string } }) {
  return (
    <Link
      href={`/game/${encodeURIComponent(game.title)}`}
      className="group rounded-xl border border-zinc-200 bg-white overflow-hidden transition hover:border-indigo-300 hover:shadow-md"
    >
      {/* Cover Image */}
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
      {/* Title */}
      <div className="p-3">
        <h3 className="font-medium text-zinc-800 group-hover:text-indigo-600 line-clamp-2 text-sm leading-snug">
          {game.title}
        </h3>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const allGames = getAllGames();
  const counts = getCategoryGameCounts();
  const latestGames = getLatestGames(12);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Hero Section */}
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          发现好游戏 🎮
        </h1>
        <p className="mt-3 text-lg text-zinc-500">
          收录 <strong className="text-indigo-600">{allGames.length}</strong> 款免费在线游戏，立即畅玩
        </p>
        <div className="mx-auto mt-6 max-w-md">
          <ClientSearchBox />
        </div>
      </section>

      {/* Category Grid */}
      <section className="mb-10">
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
            <GameCard key={game.title} game={game} />
          ))}
        </div>
      </section>

      {/* Footer Description for SEO */}
      <section className="mt-16 rounded-2xl bg-indigo-50 p-8 text-center">
        <h2 className="text-2xl font-bold text-zinc-900">免费在线游戏导航</h2>
        <p className="mt-3 max-w-2xl mx-auto text-zinc-600 leading-relaxed">
          GameHub 只收录可在站内直接游玩的免费在线游戏，覆盖挂机放置、合成合并、生存射击、
          益智解谜、赛车竞速等热门分类。打开页面即可开始游戏，无需跳转到外部网站。
        </p>
      </section>
    </div>
  );
}
