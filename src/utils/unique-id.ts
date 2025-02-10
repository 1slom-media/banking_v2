export function generateUniqueId(): number {
  return Math.floor(100000 + Math.random() * 900000); // 100000 dan 999999 gacha random son
}
