// src/features/pehran/svg/PehranSVG.ts
import {
  createSVGHeader,
  closeSVG,
  rect,
  line,
  path,
  text,
  inchesToPx,
} from '../../../common/utils/SVGPlotter';
import { PehranDraft } from '../logic/PehranLogic';

export const plotPehranDraftSVG = (draft: PehranDraft): string => {
  const { pehran } = draft;
  const { seamAllowance = 0.5, showGrid = true, showMeasurements = true } = pehran as any;

  // Panel size in inches (adjust these formulas to change the shape)
  const panelWidthIn = pehran.quarterChest * 2 + 3;
  const panelHeightIn = pehran.fullLength + 4;

  const marginPx = inchesToPx(0.5);
  const panelW = inchesToPx(panelWidthIn);
  const panelH = inchesToPx(panelHeightIn);

  let svg = createSVGHeader(panelW + marginPx * 2, panelH + marginPx * 2);

  const startX = marginPx;
  const startY = marginPx;

  // Main tunic rectangle
  svg += rect(startX, startY, panelW, panelH, {
    stroke: '#8B4513',
    strokeWidth: 3,
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

  // Sleeve / armhole depth line
  const sleeveY = startY + inchesToPx(pehran.armholeDepth);
  svg += line(startX, sleeveY, startX + panelW, sleeveY, {
    stroke: '#D2691E',
    strokeWidth: 2,
  });

  // Neckline curve
  const neckCurve = `
    M ${startX + inchesToPx(2)} ${startY}
    Q ${startX + panelW / 2} ${startY + inchesToPx(pehran.frontNeckDepth)}
      ${startX + panelW - inchesToPx(2)} ${startY}
  `;
  svg += path(neckCurve.trim(), {
    stroke: '#CD853F',
    strokeWidth: 3,
    fill: 'none',
  });

  // seam allowance for neckline (visual)
  if (seamAllowance && seamAllowance > 0) {
    const saPx = inchesToPx(seamAllowance) * 2;
    svg += path(neckCurve.trim(), { stroke: '#10b981', strokeWidth: saPx, fill: 'none', strokeOpacity: 0.12 });
  }

  // Labels
  if (showMeasurements) {
    svg += text(startX + 15, startY - 15, `Pehran • Chest: ${pehran.chest}" Length: ${pehran.fullLength}"`, { fontSize: 16, fill: '#8B4513' });
  }

  svg += text(
    startX + panelW / 2 - 50,
    sleeveY + 25,
    `Armhole: ${pehran.armholeDepth}"`,
    { fontSize: 13, fill: '#A0522D' },
  );

  svg += closeSVG();
  return svg;
};
