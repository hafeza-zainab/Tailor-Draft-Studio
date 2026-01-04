// src/features/rida/svg/RidaSVG.ts
import { createSVGHeader, closeSVG, rect, line, path, text, inchesToPx } from '../../../common/utils/SVGPlotter';
import { RidaDraft } from '../logic/RidaLogic';

export const plotRidaDraftSVG = (draft: RidaDraft): string => {
  const { rida } = draft;
  const { seamAllowance = 0.5, showGrid = true, showMeasurements = true } = rida as any;

  const panelWidthIn = rida.chest / 4 + 3;
  const panelHeightIn = rida.fullBackLength + 3;

  const marginPx = inchesToPx(0.5);
  const startX = marginPx;
  const startY = marginPx;

  let svg = createSVGHeader(panelWidthIn + 1, panelHeightIn + 1);

  const panelW = inchesToPx(panelWidthIn);
  const panelH = inchesToPx(panelHeightIn);

  // Basic rectangle (body)
  svg += rect(startX, startY, panelW, panelH, { stroke: '#2874A6', strokeWidth: 2 });

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

  // Armhole horizontal line
  const armholeY = startY + inchesToPx(rida.armholeDepth);
  svg += line(startX, armholeY, startX + panelW, armholeY, { stroke: '#1F618D', strokeWidth: 1.5 });

  // Front yoke arc (semi circle top front)
  const yokeRadiusPx = inchesToPx(rida.frontYokeDepth);
  const yokePath = `M${startX + 10} ${startY + yokeRadiusPx} A${yokeRadiusPx} ${yokeRadiusPx},0,0,1,${startX + panelW - 10} ${startY + yokeRadiusPx}`;
  svg += path(yokePath, { stroke: '#2980B9', strokeWidth: 2, fill: 'none' });

  if (seamAllowance && seamAllowance > 0) {
    const saPx = inchesToPx(seamAllowance) * 2;
    svg += path(yokePath, { stroke: '#10b981', strokeWidth: saPx, fill: 'none', strokeOpacity: 0.12 });
  }

  // Label measurements
  if (showMeasurements) {
    svg += text(startX + 15, startY - 15, `Rida • Chest: ${rida.chest}" Front Length: ${rida.fullFrontLength}"`, { fontSize: 14 });
    svg += text(startX + panelW / 2, armholeY + 20, `Armhole Depth: ${rida.armholeDepth}"`, { fontSize: 12 });
  }

  svg += closeSVG();
  return svg;
};
