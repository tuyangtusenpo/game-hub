import { notFound } from "next/navigation";
import Link from "next/link";
import { getGameByTitle, getAllGames, categories, getGamesByCategory, isEmbeddableGame } from "@/data/games";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ title: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { title } = await params;
  const game = getGameByTitle(title);
  if (!game) return { title: "游戏未找到 - GameHub" };
  return {
    title: `${game.title} - GameHub 在线玩`,
    description: game.description || `${game.title} - 免费在线游戏，立即畅玩`,
  };
}

export default async function GameDetailPage({ params }: PageProps) {
  const { title } = await params;
  const game = getGameByTitle(title);
  if (!game || !isEmbeddableGame(game)) notFound();
  const details = game.details;

  // Find matching categories
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

  const embedUrl = game.embed_url;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-zinc-400">
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

      {/* Game Title & Tags */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
          {game.title}
        </h1>
        <div className="mt-2 flex flex-wrap gap-2">
          {matchingCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 hover:bg-zinc-200"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Game iframe — always embed */}
      <div className="mb-6 rounded-xl overflow-hidden border border-zinc-200 bg-black shadow-lg">
        <iframe
          src={embedUrl}
          className="w-full h-[500px] sm:h-[600px]"
          allow="autoplay; fullscreen; gamepad; clipboard-read; clipboard-write"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups allow-popups-to-escape-sandbox"
          title={game.title}
        />
      </div>

      {/* Description */}
      {(details?.overview || game.description) && (
        <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="mb-2 text-lg font-semibold text-zinc-800">玩法介绍</h2>
          <p className="text-sm text-zinc-600 leading-relaxed">
            {details?.overview || game.description}
          </p>
        </div>
      )}

      {(details?.controls?.length || details?.howToPlay?.length || details?.tips?.length || details?.developer) && (
        <section className="mb-8 grid gap-4 md:grid-cols-2">
          {details?.controls?.length ? (
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <h2 className="mb-3 text-lg font-semibold text-zinc-800">操作说明</h2>
              <ul className="space-y-2 text-sm text-zinc-600">
                {details.controls.map((control) => (
                  <li key={control} className="rounded-lg bg-zinc-50 px-3 py-2">
                    {control}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {details?.tips?.length ? (
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <h2 className="mb-3 text-lg font-semibold text-zinc-800">游戏技巧</h2>
              <ul className="space-y-2 text-sm text-zinc-600">
                {details.tips.map((tip) => (
                  <li key={tip} className="rounded-lg bg-zinc-50 px-3 py-2">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {details?.howToPlay?.length ? (
            <div className="rounded-xl border border-zinc-200 bg-white p-5 md:col-span-2">
              <h2 className="mb-3 text-lg font-semibold text-zinc-800">怎么玩</h2>
              <div className="space-y-3 text-sm leading-relaxed text-zinc-600">
                {details.howToPlay.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          ) : null}

          {details?.developer ? (
            <div className="rounded-xl border border-zinc-200 bg-white p-5 md:col-span-2">
              <h2 className="mb-2 text-lg font-semibold text-zinc-800">开发者</h2>
              <p className="text-sm text-zinc-600">{details.developer}</p>
            </div>
          ) : null}
        </section>
      )}

      {/* Related Games */}
      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-zinc-800">更多同类游戏</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {related.map((g) => (
              <Link
                key={g.title}
                href={`/game/${encodeURIComponent(g.title)}`}
                className="group rounded-xl border border-zinc-200 bg-white overflow-hidden transition hover:border-indigo-300 hover:shadow-md"
              >
                {g.image ? (
                  <div className="aspect-video bg-zinc-100 overflow-hidden">
                    <img
                      src={g.image}
                      alt={g.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <span className="text-2xl">🎮</span>
                  </div>
                )}
                <div className="p-3">
                  <h3 className="font-medium text-zinc-800 group-hover:text-indigo-600 line-clamp-2 text-sm leading-snug">
                    {g.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
