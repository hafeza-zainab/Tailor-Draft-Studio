// Basic polygon offset utility (outward-only) for straight segments.
// Input points are in SVG px coordinates.
export type Pt = { x: number; y: number };

function normalize(v: Pt) {
  const len = Math.hypot(v.x, v.y) || 1;
  return { x: v.x / len, y: v.y / len };
}

function perp(v: Pt) {
  return { x: -v.y, y: v.x };
}

export function offsetPolygon(points: Pt[], offset: number): Pt[] {
  if (points.length < 2) return points.slice();
  const n = points.length;
  const out: Pt[] = [];

  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];

    const v1 = normalize({ x: p1.x - p0.x, y: p1.y - p0.y });
    const v2 = normalize({ x: p2.x - p1.x, y: p2.y - p1.y });

    const n1 = perp(v1);
    const n2 = perp(v2);

    // average normals
    const avg = normalize({ x: n1.x + n2.x, y: n1.y + n2.y });
    // avoid too-small joins
    const scale = offset / Math.max(0.001, (avg.x * n1.x + avg.y * n1.y));
    out.push({ x: p1.x + avg.x * scale, y: p1.y + avg.y * scale });
  }

  return out;
}

export function polygonToPath(points: Pt[]): string {
  if (!points.length) return '';
  const cmds = [`M ${points[0].x} ${points[0].y}`];
  for (let i = 1; i < points.length; i++) cmds.push(`L ${points[i].x} ${points[i].y}`);
  cmds.push('Z');
  return cmds.join(' ');
}

export default { offsetPolygon, polygonToPath };
