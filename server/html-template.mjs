const DEFAULT_HEAD_BLOCK = /<!-- app-head:start -->[\s\S]*?<!-- app-head:end -->/;

export function composeHtml({ template, appHtml = '', headTags = '', useSsr = false }) {
  const renderedHead = useSsr && headTags ? headTags : null;
  const withApp = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

  if (!renderedHead) {
    return withApp;
  }

  if (!DEFAULT_HEAD_BLOCK.test(withApp)) {
    throw new Error('Bloco de metadados padrao nao encontrado no template HTML.');
  }

  return withApp.replace(DEFAULT_HEAD_BLOCK, renderedHead);
}
