import { redirect } from "next/navigation";

// 主地圖已移到首頁 `/`；舊 /map 連結導回首頁。
export default function MapRedirect() {
  redirect("/");
}
