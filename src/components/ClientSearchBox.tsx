'use client';

export default function ClientSearchBox() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const input = form.elements.namedItem("q") as HTMLInputElement;
        if (input.value.trim()) {
          window.location.href = `/game/${encodeURIComponent(input.value.trim())}`;
        }
      }}
    >
      <input
        type="text"
        name="q"
        placeholder="搜索游戏名称..."
        className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        autoComplete="off"
      />
    </form>
  );
}
