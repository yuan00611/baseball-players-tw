"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

/**
 * 電子報訂閱框（M1 視覺示意，未接後端；M6 再串真正的訂閱服務）。
 * 送出僅在前端顯示感謝訊息，不發送任何資料。
 */
export function NewsletterForm() {
  const [done, setDone] = React.useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
      className="flex flex-col gap-2"
      aria-label="訂閱電子報"
    >
      <label htmlFor="newsletter-email" className="text-sm text-text-muted">
        訂閱電子報，掌握旅美幫最新動態
      </label>
      <div className="flex gap-2">
        <input
          id="newsletter-email"
          type="email"
          required
          placeholder="you@example.com"
          className="min-w-0 flex-1 rounded-md border border-border-subtle bg-surface px-3 py-2 text-sm text-text outline-none focus-visible:border-accent"
        />
        <Button type="submit" variant="accent" size="sm">
          訂閱
        </Button>
      </div>
      {done && (
        <p role="status" className="text-sm text-success">
          感謝訂閱（示意，尚未串接後端）
        </p>
      )}
    </form>
  );
}
