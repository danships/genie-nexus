// config.js: basic config for docmd
module.exports = {
  // Core Site Metadata
  siteTitle: 'Genie Nexus',
  // Define a base URL for your site, crucial for SEO and absolute paths
  // No trailing slash
  siteUrl: 'https://www.gnxs.io', // Replace with your actual deployed URL

  // Logo Configuration
  logo: {
    light: '/assets/images/genie-nexus-logo-light.png', // Path relative to outputDir root
    dark: '/assets/images/genie-nexus-logo-dark.png', // Path relative to outputDir root
    alt: 'Genie Nexus logo', // Alt text for the logo
    href: '/', // Link for the logo, defaults to site root
  },

  // Directory Configuration
  srcDir: 'docs', // Source directory for Markdown files
  outputDir: 'site', // Directory for generated static site

  // Theme Configuration
  theme: {
    name: 'sky', // Themes: 'default', 'sky'
    defaultMode: 'dark', // Initial color mode: 'light' or 'dark'
    enableModeToggle: true, // Show UI button to toggle light/dark modes
    customCss: [],
  },

  // Custom JavaScript Files
  customJs: [
    // Array of paths to custom JS files, loaded at end of body
    // '/assets/js/custom-script.js', // Paths relative to outputDir root
    '/assets/js/docmd-image-lightbox.js', // Image lightbox functionality
  ],

  // Plugins Configuration
  // Plugins are configured here. docmd will look for these keys.
  plugins: {
    // SEO Plugin Configuration
    // Most SEO data is pulled from page frontmatter (title, description, image, etc.)
    // These are fallbacks or site-wide settings.
    seo: {
      // Default meta description if a page doesn't have one in its frontmatter
      defaultDescription:
        'Genie Nexus - An intelligent configurable router for LLM and HTTP requests, providing seamless integration and routing capabilities.',
      openGraph: {
        // For Facebook, LinkedIn, etc.
        // siteName: 'docmd Documentation', // Optional, defaults to config.siteTitle
        // Default image for og:image if not specified in page frontmatter
        // Path relative to outputDir root
        defaultImage: '/assets/images/genie-nexus-preview.png',
      },
      twitter: {
        // For Twitter Cards
        cardType: 'summary_large_image', // 'summary', 'summary_large_image'
        // siteUsername: '@docmd_handle',    // Your site's Twitter handle (optional)
        // creatorUsername: '@your_handle',  // Default author handle (optional, can be overridden in frontmatter)
      },
    },
    // Analytics Plugin Configuration
    analytics: {
      // Google Analytics 4 (GA4)
      googleV4: {
        measurementId: '', // Add your GA4 Measurement ID here
      },
    },
    // Enable Sitemap plugin
    sitemap: {
      defaultChangefreq: 'weekly',
      defaultPriority: 0.8,
    },
    // Add other future plugin configurations here by their key
  },

  // Navigation Structure (Sidebar)
  // Icons are kebab-case names from Lucide Icons (https://lucide.dev/)
  navigation: [
    { title: 'Welcome', path: '/', icon: 'home' }, // Corresponds to docs/index.md
    {
      title: 'Getting Started',
      icon: 'rocket',
      path: '#',
      children: [
        {
          title: 'Introduction',
          path: '/introduction',
          icon: 'book-open',
        },
        {
          title: 'Installation',
          path: '/installation',
          icon: 'download',
        },
        {
          title: 'Quick Start',
          path: '/quick-start',
          icon: 'play',
        },
      ],
    },
    {
      title: 'Core Features',
      icon: 'sparkles',
      path: '#',
      children: [
        {
          title: 'LLM Routing',
          path: '/features/llm-routing',
          icon: 'brain',
        },
        {
          title: 'HTTP Routing',
          path: '/features/http-routing',
          icon: 'globe',
        },
        {
          title: 'Configuration',
          path: '/features/configuration',
          icon: 'settings',
        },
      ],
    },
    {
      title: 'Advanced',
      icon: 'zap',
      path: '#',
      children: [
        {
          title: 'Custom Routes',
          path: '/advanced/custom-routes',
          icon: 'route',
        },
        {
          title: 'Middleware',
          path: '/advanced/middleware',
          icon: 'layers',
        },
        {
          title: 'Error Handling',
          path: '/advanced/error-handling',
          icon: 'alert-triangle',
        },
      ],
    },
    {
      title: 'API Reference',
      icon: 'code',
      path: '/api-reference',
    },
    // External links:
    {
      title: 'GitHub',
      path: 'https://github.com/your-username/genie-nexus',
      icon: 'github',
      external: true,
    },
  ],

  // Footer Configuration
  // Markdown is supported here.
  footer:
    '© ' + new Date().getFullYear() + ' Genie Nexus. All rights reserved.',

  // Favicon Configuration
  // Path relative to outputDir root
  favicon: '/assets/favicon.ico',
};
