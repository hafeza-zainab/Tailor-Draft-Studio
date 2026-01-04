// src/features/jhabla/svg/JhablaSVG.ts
import {
  createSVGHeader,
  closeSVG,
  rect,
  line,
  path,
  text,
  inchesToPx,
} from '../../../common/utils/SVGPlotter';

// Simple measurement object used by the preview
export type JhablaDraftArgs = {
  chest: number;
  waist: number;
  fullLength: number;
  sleeveLength: number;
  shoulder: number;
  neckRound: number;
  armholeDepth: number;
  quarterChest: number;
  seamAllowance?: number;
  showGrid?: boolean;
  showMeasurements?: boolean;
};

export const plotJhablaDraftSVG = (jhabla: JhablaDraftArgs): string => {
  const {
    seamAllowance = 0.5,
    showGrid = true,
    showMeasurements = true,
  } = jhabla;
  const panelWidthIn = jhabla.quarterChest * 2 + 2;
  const panelHeightIn = jhabla.fullLength + 2.5;

  const marginPx = inchesToPx(0.4);
  const panelW = inchesToPx(panelWidthIn);
  const panelH = inchesToPx(panelHeightIn);

  let svg = createSVGHeader(
    panelWidthIn + 1, // these utilities expect inches here in your project
    panelHeightIn + 1
  );

  const startX = marginPx;
  const startY = marginPx;

  // Main body
  svg += rect(startX, startY, panelW, panelH, {
    stroke: '#FF69B4',
    strokeWidth: 2,
    fill: 'none',
  });

  // grid
  if (showGrid) {
    const spacingPx = inchesToPx(1);
    for (let gx = startX; gx <= startX + panelW; gx += spacingPx) {
      svg += line(gx, startY, gx, startY + panelH, { stroke: '#f3f4f6', strokeWidth: 1 });
    }
    for (let gy = startY; gy <= startY + panelH; gy += spacingPx) {
      svg += line(startX, gy, startX + panelW, gy, { stroke: '#f3f4f6', strokeWidth: 1 });
    }
  }

  // Armhole line
  const armholeY = startY + inchesToPx(jhabla.armholeDepth);
  svg += line(startX, armholeY, startX + panelW, armholeY, {
    stroke: '#FF1493',
    strokeWidth: 1.5,
  });

  // Smooth side curve (cubic Bezier)
  const sx = startX + panelW / 2;
  const sy = startY + inchesToPx(2);
  const ex = startX + panelW / 2;
  const ey = armholeY;
  const c1x = sx + inchesToPx(0.5);
  const c1y = sy + inchesToPx(1.5);
  const c2x = ex + inchesToPx(0.5);
  const c2y = ey - inchesToPx(1.5);
  const sideCurve = `M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`;
  svg += path(sideCurve, { stroke: '#C71585', strokeWidth: 2, fill: 'none' });

  // seam allowance visual (wider translucent stroke behind main outline)
  if (seamAllowance && seamAllowance > 0) {
    const saPx = inchesToPx(seamAllowance) * 2;
    svg += path(sideCurve, { stroke: '#10b981', strokeWidth: saPx, fill: 'none', strokeOpacity: 0.12 });
  }

  // Labels
  if (showMeasurements) {
    svg += text(startX + 10, startY - 12, `Baby Jhabla • Chest: ${jhabla.chest}" Length: ${jhabla.fullLength}"`, { fontSize: 13 });
  }
  svg += text(
    startX + 20,
    armholeY + 18,
    `Armhole: ${jhabla.armholeDepth}"`,
    { fontSize: 11 }
  );

  svg += closeSVG();
  return svg;
};
