// src/features/izar/svg/IzarSVG.ts

export type IzarDraftArgs = {
  waist: number;        // used for label
  hip: number;          // H
  fullLength: number;   // L
  bottomWidth: number;  // M (mori per leg)
  crotchDepthFront: number; // C (if 0, derived from hip)
  crotchDepthBack: number;
  riseFront: number;
  riseBack: number;
  seamAllowance?: number; // in inches (optional preview)
  showGrid?: boolean;
  showMeasurements?: boolean;
};

// simple point type
type Point = { x: number; y: number };

export function plotIzarDraftSVG(args: IzarDraftArgs): string {
  const {
    waist,
    hip,
    fullLength,
    bottomWidth,
    crotchDepthFront,
    seamAllowance = 0.5,
    showGrid = true,
    showMeasurements = true,
  } = args;

  // ===== 1. Body‑space measurements (inches) =====
  const L = fullLength;                           // length
  const H = hip;                                  // hip circumference
  const C = crotchDepthFront || (H / 3 + 2);      // seat depth
  const M = bottomWidth;                          // mori per leg

  // Ease values (tune these as you test)
  const E1 = 3;                                   // horizontal ease at hip
  const E2 = 1;                                   // extra crotch extension
  const k  = 0.75;                                // vertical offset for Bézier control

  // Guard against invalid values
  if (L <= 0 || H <= 0 || M <= 0) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <text x="10" y="100" font-size="12" fill="red">
          Invalid Izar measurements
        </text>
      </svg>
    `;
  }

  // Derived constants
  const W  = H / 4 + E1;        // base width
  const Xc = H / 4 + E2;        // crotch extension
  const Mh = M / 2;             // half mori

  // ===== 2. Define key points in BODY coordinates (inches) =====
  // Primary rectangle ABCD
  const A: Point   = { x: 0,        y: 0 };   // waist, outer seam
  const B: Point   = { x: 0,        y: L };   // hem, outer seam
  const Cpt: Point = { x: W,        y: 0 };   // waist inner reference
  const D: Point   = { x: W,        y: L };   // hem inner reference

  // Seat depth line EF
  const E: Point   = { x: 0,        y: C };
  const F: Point   = { x: W,        y: C };

  // Crotch extension G, H (nudge crotch anchor slightly left to avoid sharp point)
  const crotchNudge = Xc * 0.15;
  const G: Point   = { x: W + Xc - crotchNudge,   y: C };
  const Hpt: Point = { x: W + Xc - crotchNudge,   y: L };

  // Ankle center I and mori J, K
  const I: Point   = { x: W + Xc / 2, y: L };
  const J: Point   = { x: I.x - Mh,   y: L }; // inner ankle
  const K: Point   = { x: I.x + Mh,   y: L }; // outer ankle

  // Bézier control point P1 for crotch curve
  // Control points for a smooth cubic Bézier crotch curve
  const ctrl1: Point = { x: J.x + Xc * 0.2,           y: J.y - (L - C) * 0.5 };
  const ctrl2: Point = { x: G.x - Xc * 0.2,           y: C - k * 0.5 };

  // ===== 3. Map body coordinates → SVG coordinates =====
  const viewWidth  = 400;
  const viewHeight = 800;
  const marginX    = 40;
  const marginTop  = 40;
  const marginBot  = 40;

  const bodyWidth  = W + Xc; // max x extent
  const bodyHeight = L;      // max y extent

  const usableWidth  = viewWidth  - 2 * marginX;
  const usableHeight = viewHeight - marginTop - marginBot;

  const scale = Math.min(
    usableWidth  / bodyWidth,
    usableHeight / bodyHeight,
  );

  const offsetX = marginX;
  const offsetY = marginTop;

  const toSvg = (p: Point): Point => ({
    x: offsetX + p.x * scale,
    y: offsetY + p.y * scale,
  });

  const A_svg: Point   = toSvg(A);
  const B_svg: Point   = toSvg(B);
  const C_svg: Point   = toSvg(Cpt);
  const D_svg: Point   = toSvg(D);
  const E_svg: Point   = toSvg(E);
  const F_svg: Point   = toSvg(F);
  const G_svg: Point   = toSvg(G);
  const H_svg: Point   = toSvg(Hpt);
  const J_svg: Point   = toSvg(J);
  const K_svg: Point   = toSvg(K);
  const ctrl1_svg: Point  = toSvg(ctrl1);
  const ctrl2_svg: Point  = toSvg(ctrl2);

  // helper to format inches
  const fmt = (v: number) => `${v.toFixed(1)} in`;

  // ===== 4. Build SVG =====
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewWidth} ${viewHeight}">`;

  // Background
  svg += `
    <rect x="0" y="0" width="${viewWidth}" height="${viewHeight}" fill="#f9fafb" />
  `;

  // Seat depth line EF (guide)
  svg += `
    <line x1="${E_svg.x}" y1="${E_svg.y}" x2="${F_svg.x}" y2="${F_svg.y}"
          stroke="#9ca3af" stroke-width="1" stroke-dasharray="4 3" />
  `;

  // Outer leg seam AB
  svg += `
    <line x1="${A_svg.x}" y1="${A_svg.y}" x2="${B_svg.x}" y2="${B_svg.y}"
          stroke="#111827" stroke-width="2" />
  `;

  // Waist edge AC (no deviation)
  svg += `
    <line x1="${A_svg.x}" y1="${A_svg.y}" x2="${C_svg.x}" y2="${C_svg.y}"
          stroke="#111827" stroke-width="2" />
  `;

  // Inner reference CD (guide)
  svg += `
    <line x1="${C_svg.x}" y1="${C_svg.y}" x2="${D_svg.x}" y2="${D_svg.y}"
          stroke="#e5e7eb" stroke-width="1" stroke-dasharray="4 3" />
  `;

  // Crotch extension FG and vertical GH (guides)
  svg += `
    <line x1="${F_svg.x}" y1="${F_svg.y}" x2="${G_svg.x}" y2="${G_svg.y}"
          stroke="#6b7280" stroke-width="1.5" stroke-dasharray="4 3" />
    <line x1="${G_svg.x}" y1="${G_svg.y}" x2="${H_svg.x}" y2="${H_svg.y}"
          stroke="#e5e7eb" stroke-width="1" stroke-dasharray="4 3" />
  `;

  // Inner leg seam G–J (diagonal)
  // Inner seam will be drawn as a smooth curve (J -> G) below as part of the outline

  // Outer taper B–K
  svg += `
    <line x1="${B_svg.x}" y1="${B_svg.y}" x2="${K_svg.x}" y2="${K_svg.y}"
          stroke="#111827" stroke-width="2" />
  `;

  // Mori J–K
  svg += `
    <line x1="${J_svg.x}" y1="${J_svg.y}" x2="${K_svg.x}" y2="${K_svg.y}"
          stroke="#111827" stroke-width="2" />
  `;

  // Outline path: connect waist -> hem -> outer ankle -> inner ankle -> crotch -> waist (closed)
  svg += `
    <path d="
      M ${A_svg.x} ${A_svg.y}
      L ${B_svg.x} ${B_svg.y}
      L ${K_svg.x} ${K_svg.y}
      L ${J_svg.x} ${J_svg.y}
      L ${G_svg.x} ${G_svg.y}
      L ${C_svg.x} ${C_svg.y}
      Z
    "
      fill="none"
      stroke="#111827"
      stroke-width="2"
    />
  `;

  // Crotch curve (cubic Bézier) and outline: waist -> hem -> outer ankle -> inner ankle -> crotch -> waist
  svg += `
    <path d="
      M ${A_svg.x} ${A_svg.y}
      L ${B_svg.x} ${B_svg.y}
      L ${K_svg.x} ${K_svg.y}
      L ${J_svg.x} ${J_svg.y}
      C ${ctrl1_svg.x} ${ctrl1_svg.y}, ${ctrl2_svg.x} ${ctrl2_svg.y}, ${G_svg.x} ${G_svg.y}
      L ${C_svg.x} ${C_svg.y}
      Z
    "
      fill="none"
      stroke="#111827"
      stroke-width="2"
    />

    <!-- highlight crotch curve in red for reference -->
    <path d="
      M ${J_svg.x} ${J_svg.y}
      C ${ctrl1_svg.x} ${ctrl1_svg.y}, ${ctrl2_svg.x} ${ctrl2_svg.y}, ${G_svg.x} ${G_svg.y}
    "
      fill="none"
      stroke="#ef4444"
      stroke-width="2"
    />
  `;

  // Background grid (optional)
  if (showGrid) {
    const gridSpacing = 1; // inches per major grid line
    const minorEvery = 1; // minor grid step (same here)
    for (let gx = 0; gx <= bodyWidth; gx += gridSpacing) {
      const xsvg = offsetX + gx * scale;
      svg += `<line x1="${xsvg}" y1="${offsetY}" x2="${xsvg}" y2="${offsetY + bodyHeight * scale}"
            stroke="#f3f4f6" stroke-width="1" />`;
    }
    for (let gy = 0; gy <= bodyHeight; gy += gridSpacing) {
      const ysvg = offsetY + gy * scale;
      svg += `<line x1="${offsetX}" y1="${ysvg}" x2="${offsetX + bodyWidth * scale}" y2="${ysvg}"
            stroke="#f3f4f6" stroke-width="1" />`;
    }
  }

  // Title and labels
  svg += `
    <text x="${viewWidth / 2}" y="${marginTop - 12}"
          text-anchor="middle"
          font-size="16"
          font-weight="600"
          fill="#111827">
      IZAR – FRONT LEG (GEOMETRIC)
    </text>

    ${showMeasurements ? `
    <text x="${A_svg.x + 4}" y="${A_svg.y - 6}"
          font-size="10" fill="#4b5563">
      Waist edge (W) = ${fmt(W)}
    </text>
    ` : ''}

    ${showMeasurements ? `
    <text x="${E_svg.x + 4}" y="${E_svg.y - 4}"
          font-size="10" fill="#4b5563">
      Seat depth (C) = ${fmt(C)}
    </text>
    ` : ''}

    ${showMeasurements ? `
    <text x="${G_svg.x + 4}" y="${G_svg.y - 4}"
          font-size="10" fill="#4b5563">
      Crotch extension (Xc) = ${fmt(Xc)}
    </text>
    ` : ''}

    ${showMeasurements ? `
    <text x="${J_svg.x}" y="${J_svg.y + 14}"
          font-size="10" fill="#4b5563">
      Mori M = ${fmt(M)} (Mh = ${fmt(Mh)})
    </text>
    ` : ''}

    ${showMeasurements ? `
    <text x="${viewWidth / 2}" y="${viewHeight - 16}"
          text-anchor="middle"
          font-size="10" fill="#6b7280">
      L = ${fmt(L)}, H = ${fmt(H)}, Waist = ${fmt(waist)}
    </text>
    ` : ''}
  `;

  // --- seam allowance (visual) ---
  if (seamAllowance && seamAllowance > 0) {
    // reuse existing outline path by stroking it with a wider semi-transparent stroke
    const saPx = seamAllowance * scale * 2; // total extra stroke width
    // draw a widened stroke behind the outline to represent seam allowance area
    svg += `
      <g stroke-opacity="0.18" stroke="#10b981" fill="none" stroke-linejoin="round" stroke-linecap="round">
        <path d="
          M ${A_svg.x} ${A_svg.y}
          L ${B_svg.x} ${B_svg.y}
          L ${K_svg.x} ${K_svg.y}
          L ${J_svg.x} ${J_svg.y}
          C ${ctrl1_svg.x} ${ctrl1_svg.y}, ${ctrl2_svg.x} ${ctrl2_svg.y}, ${G_svg.x} ${G_svg.y}
          L ${C_svg.x} ${C_svg.y}
          Z
        " stroke-width="${saPx}" />
      </g>
    `;
  }

  svg += `</svg>`;
  return svg;
}
