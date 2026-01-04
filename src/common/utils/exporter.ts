import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { inchesToPx } from './SVGPlotter';

type ExportResult = { filePath?: string | null };

export async function exportSvgToPdf(svg: string, widthIn: number, heightIn: number, fileName = 'draft_export'): Promise<ExportResult> {
  // Wrap the raw SVG in a full HTML document sized to px
  const dpi = 96;
  const wpx = inchesToPx(widthIn, dpi);
  const hpx = inchesToPx(heightIn, dpi);

  const html = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"/></head><body style="margin:0;padding:0;"><div style="width:${wpx}px;height:${hpx}px;">${svg}</div></body></html>`;

  try {
    const options = {
      html,
      fileName,
      base64: false,
    } as any;

    const res = await RNHTMLtoPDF.convert(options);
    return { filePath: res.filePath };
  } catch (err) {
    console.error('Export PDF error', err);
    return { filePath: null };
  }
}

export default exportSvgToPdf;
