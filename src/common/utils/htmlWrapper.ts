export function wrapSvgHtml(svg: string) {
  return `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
    <meta name="color-scheme" content="light" />
    <meta name="theme-color" content="#ffffff" />
    <style>
      html,body{height:100%;margin:0;padding:10px;background:#ffffff;color-scheme:light;}
      svg{width:100%;height:100%;background:#ffffff;display:block}
      /* Prevent Android WebView force-dark from inverting colors */
      :root { color-scheme: light; }
    </style>
  </head>
  <body>
    ${svg}
  </body>
</html>`;
}

export default wrapSvgHtml;
