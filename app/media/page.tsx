import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "媒體牆",
  description: "旅美幫四平台社群整合媒體牆（開發中）。",
};

export default function MediaPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-16">
      <h1 className="font-sans text-3xl font-bold text-text">媒體牆</h1>
      <p className="mt-4 text-text-muted">施工中（M5 媒體牆）。</p>
    </div>
  );
}
