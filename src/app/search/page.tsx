import { notFound } from "next/navigation";
import Link from "next/link";
import { searchGames } from "@/data/games";
import type { Metadata } from "next";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `搜索 "${q}" - GameHub` : "搜索游戏 - GameHub",
    description: "搜索免费在线游戏，发现好游戏",
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

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  if (!q || !q.trim()) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-zinc-800">搜索游戏</h1>
        <p className="mt-2 text-zinc-500">在搜索框中输入游戏名称</p>
      </div>
    );
  }

  const results = searchGames(q);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-6 text-sm text-zinc-400">
        <Link href="/" className="hover:text-indigo-600">首页</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-700">搜索: {q}</span>
      </nav>

      <h1 className="text-2xl font-bold text-zinc-900 mb-2">
        搜索 &ldquo;{q}&rdquo;
      </h1>
      <p className="text-sm text-zinc-500 mb-8">
        找到 {results.length} 款游戏
      </p>

      {results.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {results.map((game) => (
            <GameCard key={game.title} game={game} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center text-zinc-400">
          未找到与 &ldquo;{q}&rdquo; 相关的游戏
        </div>
      )}
    </div>
  );
}
