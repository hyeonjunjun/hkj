export type SlotRole = "center" | "left" | "right" | "hidden";

export function computeSlot(
  pieceIndex: number,
  activeIndex: number,
  count: number,
): { slot: number; role: SlotRole } {
  const slot = (pieceIndex - activeIndex + count) % count;
  let role: SlotRole;
  if (slot === 0) role = "center";
  else if (slot === 1) role = "right";
  else if (slot === count - 1) role = "left";
  else role = "hidden";
  return { slot, role };
}
