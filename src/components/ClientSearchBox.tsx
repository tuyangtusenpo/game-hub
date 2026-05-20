'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback, useRef, useEffect } from 'react';

export default function ClientSearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ title: string; image?: string }[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      setResults(data.games || []);
    } catch {
      setResults([]);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 200);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        placeholder="搜索游戏名称..."
        className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        autoComplete="off"
      />
      {showDropdown && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-lg"
        >
          {results.slice(0, 8).map((g) => (
            <a
              key={g.title}
              href={`/game/${encodeURIComponent(g.title)}`}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-indigo-50 hover:text-indigo-700 transition"
            >
              {g.image ? (
                <img src={g.image} alt="" className="w-8 h-8 rounded object-cover bg-zinc-100" />
              ) : (
                <div className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center text-zinc-300 text-xs">🎮</div>
              )}
              <span>{g.title}</span>
            </a>
          ))}
          {results.length > 8 && (
            <a
              href={`/search?q=${encodeURIComponent(query)}`}
              className="block px-4 py-2.5 text-center text-xs text-indigo-500 hover:bg-indigo-50 border-t border-zinc-100"
            >
              查看全部 {results.length} 个结果 →
            </a>
          )}
        </div>
      )}
      {showDropdown && query.trim() && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-xl border border-zinc-200 bg-white p-4 text-center text-sm text-zinc-400 shadow-lg">
          未找到相关游戏
        </div>
      )}
    </div>
  );
}
