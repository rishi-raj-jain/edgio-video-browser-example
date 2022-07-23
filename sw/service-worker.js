import { relativizeURL } from '@/lib/helper'
import { Prefetcher } from '@layer0/prefetch/sw'
import { precacheAndRoute } from 'workbox-precaching'
import { skipWaiting, clientsClaim } from 'workbox-core'
import DeepFetchPlugin from '@layer0/prefetch/sw/DeepFetchPlugin'

skipWaiting()
clientsClaim()
precacheAndRoute(self.__WB_MANIFEST || [])

new Prefetcher({
  plugins: [
    new DeepFetchPlugin([
      // Query the PDP API response for images to prefetch
      // Prefetch login is handled in pages/_app.js
      // Relativize the absolute link using json-query helpers
      // relativize function is applied on the array returned by the selector
      {
        jsonQuery: 'pageProps.data.image:relativize',
        jsonQueryOptions: {
          locals: {
            relativize: (input) => {
              let prefetchLinks = structuredClone(input)
              if (prefetchLinks && prefetchLinks.length > 0) {
                prefetchLinks = prefetchLinks.filter((i) => i)
                if (prefetchLinks.length > 0) return prefetchLinks.map((i) => i['medium']).map((i) => relativizeURL(i))
              }
              return ['/logo/white.svg']
            },
          },
        },
        maxMatches: 6,
        as: 'image',
      },
    ]),
  ],
})
  .route()
  // Cache the images coming from any route (including
  // cross-origin) assets that contains `.link` in it
  // Read more on caching cross-origin requests at
  // https://docs.layer0.co/docs/api/prefetch/classes/_sw_prefetcher_.prefetcher.html#cache
  .cache(/^https:\/\/(.*?)\.link\/.*/)
  .cache(/^https:\/\/(.*?)\.net\/.*/)
