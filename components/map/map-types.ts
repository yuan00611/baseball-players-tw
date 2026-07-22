/** 投影後、可序列化的地圖 pin（server 算好傳給 client view） */
export type MapPin = {
  x: number;
  y: number;
  variant: "homebase" | "schedule";
  /** homebase：同球場的選手們 */
  players?: { name: string; slug: string; affiliate: string; level: string }[];
  venueApprox?: boolean;
  /** schedule：對戰資訊 */
  teamName?: string;
  playerName?: string;
  playerSlug?: string;
  matchup?: string;
  taiwanTime?: string;
  status?: string;
  venue?: string;
  homeAway?: "主場" | "客場";
};
