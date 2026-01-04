// src/features/saya/svg/SayaSVG.ts
import { createSVGHeader, closeSVG, rect, line, path, text, inchesToPx } from '../../../common/utils/SVGPlotter';
import { SayaDraft } from '../logic/SayaLogic';

export const plotSayaDraftSVG = (draft: SayaDraft): string => {
  const { saya } = draft;
  const { seamAllowance = 0.5, showGrid = true, showMeasurements = true } = saya as any;
  const panelWidthIn = saya.quarterChest * 2 + 2.5;
  const panelHeightIn = saya.fullLength + 3;

  let svg = createSVGHeader(panelWidthIn + 1, panelHeightIn + 1);
  const marginPx = inchesToPx(0.5);
  const startX = marginPx;
  const startY = marginPx;

  const panelW = inchesToPx(panelWidthIn);
  const panelH = inchesToPx(panelHeightIn);

  // Main Saya tunic rectangle
  svg += rect(startX, startY, panelW, panelH, { stroke: '#1E3A8A', strokeWidth: 2 });

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
  const armholeY = startY + inchesToPx(saya.armholeDepth);
  svg += line(startX, armholeY, startX + panelW, armholeY, { stroke: '#2563EB', strokeWidth: 1.5 });

  // Collar curve from neckline
  // convert collar Q to cubic for smoother control
  const cx = startX + panelW / 2;
  const collarStartX = startX + 10;
  const collarEndX = startX + panelW - 10;
  const collarDepthPx = inchesToPx(saya.collarDepth);
  const c1x = collarStartX + inchesToPx(0.8);
  const c1y = startY - collarDepthPx / 2;
  const c2x = collarEndX - inchesToPx(0.8);
  const c2y = startY - collarDepthPx / 2;
  const collarPath = `M ${collarStartX} ${startY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${collarEndX} ${startY}`;
  svg += path(collarPath, { stroke: '#3B82F6', strokeWidth: 2, fill: 'none' });

  if (seamAllowance && seamAllowance > 0) {
    const saPx = inchesToPx(seamAllowance) * 2;
    svg += path(collarPath, { stroke: '#10b981', strokeWidth: saPx, fill: 'none', strokeOpacity: 0.12 });
  }

  // Labels
  if (showMeasurements) {
    svg += text(startX + 20, startY - 20, `Saya • Chest: ${saya.chest}" Length: ${saya.fullLength}"`, { fontSize: 14 });
    svg += text(startX + 10, armholeY + 20, `Armhole: ${saya.armholeDepth}"`, { fontSize: 12 });
  }

  svg += closeSVG();
  return svg;
};
