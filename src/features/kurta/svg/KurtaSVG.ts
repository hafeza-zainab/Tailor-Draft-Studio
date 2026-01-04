// src/features/kurta/svg/KurtaSVG.ts
import {
  createSVGHeader,
  closeSVG,
  rect,
  line,
  text,
  inchesToPx,
} from '../../../common/utils/SVGPlotter';
import { offsetPolygon, polygonToPath } from '../../../common/utils/geometry';
import type { KurtaDraft } from '../logic/KurtaLogic';

export const plotKurtaDraftSVG = (draft: KurtaDraft): string => {
  const { kurta } = draft;
  const { seamAllowance = 0.5, showGrid = true, showMeasurements = true } = kurta as any;

  const panelWidthIn = Math.max(kurta.chest / 2 + 4, 18);
  const panelHeightIn = Math.max(kurta.fullLength + 4, 28);

  const marginPx = inchesToPx(0.5);
  const panelW = inchesToPx(panelWidthIn);
  const panelH = inchesToPx(panelHeightIn);

  let svg = createSVGHeader(panelW + marginPx * 2, panelH + marginPx * 2);

  const startX = marginPx;
  const startY = marginPx;

  svg += rect(startX, startY, panelW, panelH, {
    stroke: '#2c3e50',
    strokeWidth: 2,
    fill: '#f8f9fa',
  });

  // precise seam allowance (outward-only) for rectangular panel
  const seamAllowanceIn = (kurta as any).seamAllowance || 0.5;
  if (seamAllowanceIn && seamAllowanceIn > 0) {
    const saPx = inchesToPx(seamAllowanceIn);
    const poly = [
      { x: startX, y: startY },
      { x: startX + panelW, y: startY },
      { x: startX + panelW, y: startY + panelH },
      { x: startX, y: startY + panelH },
    ];
    const outer = offsetPolygon(poly, saPx);
    const outerPath = polygonToPath(outer);
    svg += `<path d="${outerPath}" fill="none" stroke="#10b981" stroke-opacity="0.14" stroke-width="${saPx * 2}"/>`;
  }

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

  const centerX = startX + panelW / 2;
svg += line(
  centerX,
  startY,
  centerX,
  startY + panelH,
  { stroke: '#64748b', strokeWidth: 2 }
);


const hemY = startY + panelH;
svg += line(
  startX,
  hemY,
  startX + panelW,
  hemY,
  { stroke: '#64748b', strokeWidth: 2 }
);

  if (showMeasurements) {
    svg += text(startX + 8, startY - 14, `Kurta • Chest: ${kurta.chest}" Length: ${kurta.fullLength}"`, { fontSize: 13 });
  }

  // seam allowance visualization
  if (seamAllowance && seamAllowance > 0) {
    const saPx = inchesToPx(seamAllowance) * 2;
    // draw a larger rect behind
    svg = svg.replace('<rect', `<g stroke-opacity="0.14"><rect`);
    svg += `</g>`;
  }


  return svg + closeSVG();
};
