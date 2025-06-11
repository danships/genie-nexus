export default async function genieNexusPlugin() {
  return {
    name: 'genie-nexus',
    injectHtmlTags: () => ({
      headTags: [
        {
          tagName: 'script',
          attributes: {
            type: 'text/javascript',
            src: 'https://a.debuggingdan.com/addan',
            ['data-website-id']: '5e9299bb-266e-4735-8422-33d2d46b0349',
            ['site-domains']: 'www.gnxs.io',
            ['data-tag']: 'lp',
          },
        },
        {
          tagName: 'script',
          attributes: {
            type: 'text/javascript',
            src: '/docs/genie-nexus.js',
          },
        },
      ],
    }),
  };
}
