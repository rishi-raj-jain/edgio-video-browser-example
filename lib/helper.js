export const relativizeURL = (str) => str.replace('https://static.tvmaze.com', '/l0-opt?quality=30&img=https://static.tvmaze.com')

export const getOrigin = (req) => {
  let origin
  if (typeof window !== 'undefined') {
    origin = window.location.origin
  }
  if (req) {
    let hostURL = req.headers['host']
    if (hostURL) {
      hostURL = hostURL.replace('http://', '')
      hostURL = hostURL.replace('https://', '')
      if (hostURL.includes('localhost:') || hostURL.includes('127.0.0.1')) {
        origin = `http://${hostURL}`
      } else {
        origin = `https://${hostURL}`
      }
    }
  }
  return origin
}
