const LABEL_PALETTE = [
  { bg: "#2D6A4F", text: "#FFFFFF" },
  { bg: "#6B8E23", text: "#FFFFFF" },
  { bg: "#1B4965", text: "#FFFFFF" },
  { bg: "#8B5A2B", text: "#FFFFFF" },
  { bg: "#6B4C7A", text: "#FFFFFF" },
  { bg: "#B5651D", text: "#FFFFFF" },
  { bg: "#4A6670", text: "#FFFFFF" },
  { bg: "#9B4F4F", text: "#FFFFFF" },
] as const;

export type LabelPaletteColor = (typeof LABEL_PALETTE)[number];

function hashString(value: string): number {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = value.charCodeAt(index) + ((hash << 5) - hash);
  }

  return Math.abs(hash);
}

function getPaletteIndex(name: string): number {
  const normalized = name.trim().toLowerCase();
  return hashString(normalized) % LABEL_PALETTE.length;
}

export function getLabelPaletteColor(name: string): LabelPaletteColor {
  return LABEL_PALETTE[getPaletteIndex(name)];
}
