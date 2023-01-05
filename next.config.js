const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')
//const withOptimizedImages = require('next-optimized-images');

const linguiConfig = require('./lingui.config.js')

const { locales, sourceLocale } = linguiConfig

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// Babylon is typescript. NextJS expects JS node_modules.
// This allows next to compile the module
const withTM = require('next-transpile-modules')(['@babylonjs/core', '@babylonjs/loaders'])

// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
// https://github.com/vercel/next.js/issues/30601 recommends setting outputFileTracing to false

//const { withSentryConfig } = require('@sentry/nextjs')

const nextConfig = {
  webpack: (config) => {
    config.module.rules = [
      ...config.module.rules,
      {
        resourceQuery: /raw-lingui/,
        type: 'javascript/auto',
      },
    ]
    return config
  },
  outputFileTracing: false,
  experimental: {
    esmExternals: true,
  },
  pwa: {
    dest: 'public',
    runtimeCaching,
    disable: process.env.NODE_ENV === 'development',
  },
  images: {
    domains: [
      'deepspace.game',
      'logos.covalenthq.com',
      'assets.deepspace.game',
      'dev-assets.deepspace.game',
      'test-assets.deepspace.game',
    ],
  },
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/outpost/ships',
        permanent: true,
      },
      {
        source: '/outpost',
        destination: '/outpost/ships',
        permanent: true,
      },
      {
        source: '/shipyard',
        destination: '/shipyard/ships',
        permanent: true,
      },
      {
        source: '/inventory',
        destination: '/inventory/ships',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/add/:token*',
        destination: '/exchange/add/:token*',
      },
      {
        source: '/remove/:token*',
        destination: '/exchange/remove/:token*',
      },
      {
        source: '/create/:token*',
        destination: '/exchange/add/:token*',
      },
      {
        source: '/swap',
        destination: '/exchange/swap',
      },
      {
        source: '/swap/:token*',
        destination: '/exchange/swap/:token*',
      },
      {
        source: '/pool',
        destination: '/exchange/pool',
      },
      {
        source: '/find',
        destination: '/exchange/find',
      },
    ]
  },
  i18n: {
    localeDetection: true,
    locales,
    defaultLocale: sourceLocale,
  },
}

/*
const SentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
}
*/

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
//module.exports = withTM(withSentryConfig(withPWA(withBundleAnalyzer(nextConfig)), SentryWebpackPluginOptions))
module.exports = withTM(withPWA(withBundleAnalyzer(nextConfig)))

// Don't delete this console log, useful to see the config in Vercel deployments
console.log('next.config.js', JSON.stringify(module.exports, null, 2))
