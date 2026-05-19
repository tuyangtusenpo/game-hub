import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GameHub - 游戏导航站",
  description: "发现最好的免费在线游戏，分类浏览挂机、合成、生存、射击等热门游戏。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 font-sans">
        <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-indigo-600 hover:text-indigo-700"
            >
              GameHub
            </Link>
            <nav className="flex items-center gap-1">
              <Link
                href="/"
                className="rounded px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              >
                首页
              </Link>
              <div className="group relative">
                <button className="rounded px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900">
                  分类浏览 ↓
                </button>
                <div className="invisible absolute right-0 top-full z-50 w-48 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                  <Link href="/idle" className="block px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600">挂机 / 放置</Link>
                  <Link href="/merge" className="block px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600">合成 / 合并</Link>
                  <Link href="/survivor" className="block px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600">生存 / 幸存者</Link>
                  <Link href="/shooter" className="block px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600">射击</Link>
                  <Link href="/puzzle" className="block px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600">益智 / 解谜</Link>
                  <Link href="/racing" className="block px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600">赛车 / 竞速</Link>
                  <Link href="/rpg" className="block px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600">角色扮演</Link>
                  <Link href="/defense" className="block px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600">塔防 / 防守</Link>
                  <Link href="/arcade" className="block px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600">街机 / 休闲</Link>
                  <Link href="/tycoon" className="block px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600">大亨 / 经营</Link>
                </div>
              </div>
            </nav>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="border-t border-zinc-200 bg-white py-6">
          <div className="mx-auto max-w-6xl px-4 text-center text-sm text-zinc-500">
            <p>© 2026 GameHub 游戏导航站 · 发现好游戏</p>
            <p className="mt-1 text-xs text-zinc-400">
              数据来源: CrazyGames, Poki, itch.io · 仅供导航参考
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
