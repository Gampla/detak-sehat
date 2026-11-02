// Status kunci aktivitas yang diatur admin. Tidak ada baris = terbuka (bawaan).
import { prisma } from "./prisma";

export async function lockedKeys() {
  const rows = await prisma.activitySetting.findMany({ where: { isOpen: false }, select: { key: true } });
  return new Set(rows.map((r) => r.key));
}
export async function isLocked(key: string) {
  return (await prisma.activitySetting.count({ where: { key, isOpen: false } })) > 0;
}
