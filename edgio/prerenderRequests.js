// Determine the buildId from the build of Next.js app
let buildId = undefined
import { join } from 'path'
import { existsSync, readFileSync } from 'fs'
const buildIdPath = join(process.cwd(), '.next', 'BUILD_ID')

if (existsSync(buildIdPath)) {
  buildId = readFileSync(buildIdPath, 'utf8')
}

// Import fetch to fetch and create prerender routes
import fetch from 'node-fetch'

// Function definition referred from node_modules/@edgio/next/client.js
// More on createNextDataURL: https://docs.edg.io/guides/next#prefetching
const createNextDataURL = (params) => {
  if (buildId) {
    let { href, routeParams = {} } = params
    if (href.endsWith('/')) {
      href += 'index'
    }
    let qs = ''
    if (routeParams) {
      const keys = Object.keys(routeParams)
      if (keys.length) {
        qs = '?' + keys.map((key) => `${key}=${encodeURIComponent(routeParams[key])}`).join('&')
      }
    }
    return `/_next/data/${buildId}${href}.json${qs}`
  }
  return undefined
}

// Function to create all the paths to prerender
export default async function getPathsToPrerender() {
  const prerenderPaths = ['/']
  // Get all the slugs for the product pages
  const respCall = await fetch('https://api.tvmaze.com/schedule?country=US&date=2014-12-01')
  if (respCall.ok) {
    const resp = await respCall.json()
    // For each product, derive the non slash path and create the next data url to populate on the edge
    resp
      .filter((item) => item.show.image)
      .forEach((i) => {
        const nonSlashPath = i.show.id
        prerenderPaths.push(
          // Using createNextDataURL, make it easier to generate Next.js data json(s)
          createNextDataURL({
            href: `/show/${nonSlashPath}`,
            routeParams: {
              show: nonSlashPath,
            },
          })
        )
      })
  } else {
    console.log('The fetch call failed, no paths to populate cache with.')
  }
  // Finally, return all the paths with the intended mapping to Edgio prerender syntax
  return prerenderPaths.filter((i) => i).map((i) => ({ path: i }))
}
