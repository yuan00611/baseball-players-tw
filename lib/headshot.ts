/**
 * 官方 MLB 球員頭像 URL（來源：midfield.mlbstatic.com，同 MLB.com 頭像）。
 * 一律用 spots/240：實測 spots/120 對部分球員（如李灝宇）只回通用剪影，
 * 240 才是真人照且從不 404（最糟回官方剪影）。小尺寸顯示交給 next/image 縮放。
 * 只有 mlbamId 存在的球員才有頭像；其餘走字母 fallback（見 PlayerAvatar）。
 */
export function headshotUrl(mlbamId: number, size: 120 | 240 = 240): string {
  return `https://midfield.mlbstatic.com/v1/people/${mlbamId}/spots/${size}`;
}
