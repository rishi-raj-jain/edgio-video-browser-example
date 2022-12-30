// This file was automatically added by edgio init.
// You should commit this file to source control.

import { nextRoutes } from '@edgio/next'
import { Router } from '@edgio/core/router'
import getPathsToPrerender from './edgio/prerenderRequests'
import { API_CACHE_HANDLER, ASSET_CACHE_HANDLER, IMAGE_CACHE_HANDLER, NEXT_CACHE_HANDLER } from './edgio/cache'

// Remove this line to suppress Next's default behavior of removing trailing slashes via a redirect.
// If trailingSlash: true is set in next.config.js, removing this line will remove the redirect that adds the trailing slash.
nextRoutes.setEnforceTrailingSlash(true)

export default new Router({ indexPermalink: false })
  // Pre-render the static home page
  // By pre-rendering, once the project is deployed
  // the set of links are visited to warm the cache
  // for future visits (expected to be the first view for real users)
  // More on static prerendering: https://docs.edg.io/guides/static_prerendering
  .prerender(getPathsToPrerender)
  .match('/service-worker.js', ({ serviceWorker }) => {
    serviceWorker('.next/static/service-worker.js')
  })
  // The data in Next.js comes through _next/data/project-build-id route.
  // For the route /product/product-slug, cache this SSR route's data
  // it on the edge so that can be prefetched
  .match('/_next/data/:path*', NEXT_CACHE_HANDLER)
  // Asset caching
  .match('/_next/static/:path*', ASSET_CACHE_HANDLER)
  // API (Any backend) caching
  .match('/l0-api/:path*', API_CACHE_HANDLER)
  // Image caching
  .match('/l0-opt', IMAGE_CACHE_HANDLER)
  // Use the default set of Next.js routes
  // automatically adds routes for all files under /pages
  .use(nextRoutes)
