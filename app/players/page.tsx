import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "選手",
  description: "台灣旅美球員列表（開發中）。",
};

export default function PlayersPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-16">
      <h1 className="font-sans text-3xl font-bold text-text">選手</h1>
      <p className="mt-4 text-text-muted">施工中（M4 選手列表 + 球員頁）。</p>
    </div>
  );
}
