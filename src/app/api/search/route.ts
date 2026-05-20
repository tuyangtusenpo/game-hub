import { NextRequest, NextResponse } from 'next/server';
import { getAllGames } from '@/data/games';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') || '';
  if (!q.trim()) {
    return NextResponse.json({ games: [] });
  }

  const query = q.toLowerCase().trim();
  const allGames = getAllGames();

  const results = allGames
    .filter((g) => g.title.toLowerCase().includes(query))
    .slice(0, 20)
    .map((g) => ({
      title: g.title,
      image: g.image || '',
    }));

  return NextResponse.json({ games: results });
}
