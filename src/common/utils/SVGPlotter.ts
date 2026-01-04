export const closeSVG = (): string => {
  return '</svg>';
};

export const rect = (
  x: number,
  y: number,
  w: number,
  h: number,
  attrs: Record<string, string | number> = {}
): string => {
  const attrStr = Object.entries(attrs)
    .map(([k, v]) => `${k}="${v}"`)
    .join(' ');
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" ${attrStr}/>`;
};

export const line = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  attrs: Record<string, string | number> = {}
): string => {
  const attrStr = Object.entries(attrs)
    .map(([k, v]) => `${k}="${v}"`)
    .join(' ');
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${attrStr}/>`;
};

export const path = (
  d: string,
  attrs: Record<string, string | number> = {}
): string => {
  const attrStr = Object.entries(attrs)
    .map(([k, v]) => `${k}="${v}"`)
    .join(' ');
  return `<path d="${d}" ${attrStr}/>`;
};

export const text = (
  x: number,
  y: number,
  content: string,
  attrs: Record<string, string | number> = {}
): string => {
  const attrStr = Object.entries(attrs)
    .map(([k, v]) => `${k}="${v}"`)
    .join(' ');
  return `<text x="${x}" y="${y}" ${attrStr}>${content}</text>`;
};
export const createSVGHeader = (width: number, height: number): string => {
  // Heuristic: callers sometimes pass inches (small numbers) or pixels (large numbers).
  // If values look like inches (<=200) convert to px at 96dpi, otherwise treat as px.
  const dpi = 96;
  const toPx = (v: number) => (v <= 200 ? Math.round(v * dpi) : Math.round(v));
  const wpx = toPx(width);
  const hpx = toPx(height);

  // Return responsive SVG with viewBox and a white background rect so previews render consistently.
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${wpx} ${hpx}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
    <rect x="0" y="0" width="${wpx}" height="${hpx}" fill="#ffffff" />`;
};

export const inchesToPx = (inches: number, dpi: number = 96): number => {
  return inches * dpi;
};
