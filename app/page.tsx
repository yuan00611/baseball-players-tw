import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="font-sans text-3xl font-bold text-text md:text-4xl">
          旅美幫 2.0 — 專案地基
        </h1>
        <ThemeToggle />
      </div>

      <p className="mb-10 max-w-2xl text-text-muted">
        M0 骨架測試頁。切換右上角主題鈕確認 light/dark 反轉與重整不閃爍。
        以下為 base 元件與 design token 驗收。
      </p>

      <section className="mb-10">
        <h2 className="mb-4 font-sans text-xl font-bold text-text">
          Button 三變體
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary">Primary（紅）</Button>
          <Button variant="accent">Accent（藍）</Button>
          <Button variant="secondary">Secondary（描邊）</Button>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 font-sans text-xl font-bold text-text">Badge</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-sans text-xl font-bold text-text">Card</h2>
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>球員卡（示意）</CardTitle>
            <CardDescription>Card 元件套用 surface / border token</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-num text-2xl font-semibold text-brand">.312</p>
            <p className="text-sm text-text-muted">打擊率（假數據）</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
