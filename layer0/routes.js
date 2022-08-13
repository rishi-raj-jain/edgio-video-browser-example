import { nextRoutes } from '@layer0/next'
import { Router } from '@layer0/core/router'
import getPathsToPrerender from '@/layer0/prerenderRequests'
import { API_CACHE_HANDLER, ASSET_CACHE_HANDLER, NEXT_CACHE_HANDLER, IMAGE_CACHE_HANDLER } from './cache'

export default new Router()
  // Regex to catch multiple hostnames
  // Any deployment will have a L0 permalink
  // Don't allow Google bot to crawl it, read more on:
  // https://docs.layer0.co/guides/cookbook#blocking-search-engine-crawlers
  .noIndexPermalink()
  // Pre-render the static home page
  // By pre-rendering, once the project is deployed
  // the set of links are visited to warm the cache
  // for future visits (expected to be the first view for real users)
  // More on static prerendering: https://docs.layer0.co/guides/static_prerendering
  .prerender(getPathsToPrerender)
  // Serve the old Layer0 predefined routes by the latest prefix
  .match('/__xdn__/:path*', ({ redirect }) => {
    redirect('/__layer0__/:path*', 301)
  })
  // Serve the compiled service worker with Layer0 prefetcher working
  .match('/service-worker.js', ({ serviceWorker }) => {
    return serviceWorker('.next/static/service-worker.js')
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
  .use(nextRoutes)
