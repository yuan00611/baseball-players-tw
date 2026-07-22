/** 全站主導覽項目（Nav 桌機/手機、Footer 網站地圖共用參考） */
export type NavItem = { href: string; label: string };

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "地圖" },
  { href: "/players", label: "選手" },
  { href: "/media", label: "媒體牆" },
  { href: "/about", label: "關於" },
];
