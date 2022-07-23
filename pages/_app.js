import '@/styles/globals.css'
import { useEffect } from 'react'
import Layer0RUM from '@/layer0/rum'
import { useRouter } from 'next/router'
import Navbar from '@/components/Navbar'
import { install } from '@layer0/prefetch/window'
import installDevtools from '@layer0/devtools/install'

// Include the RUM Analytics in the production build only
if (process.env.NODE_ENV === 'production') {
  Layer0RUM('5238fa35-ae29-4984-b516-b2f03e920130')
}

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter()
  useEffect(() => {
    // Enable service worker inside the window
    install()
    // Enable devtools manually, instead of relying on defaults by Layer0
    installDevtools()
    const handleRouteChange = () => {
      if (window.location.href.replace(/\/$/, '') === window.location.origin.replace(/\/$/, '')) {
        window.requestAnimationFrame(() => window.scrollTo(0, window.homeScrollLeave))
      }
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [])
  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-[#9a1ab1] via-[#004966] to-[#01B18D]">
      <div className="flex w-full max-w-2xl flex-col items-start">
        <Navbar />
        <Component key={router.asPath} {...pageProps} />
        <div className="w-full py-5"></div>
        <div className="flex flex-row space-x-2">
          <span className="text-gray-300">Author:</span>
          <a className="font-semibold text-white" target="_blank" href="https://linkedin.com/in/rishi-raj-jain">
            Rishi Raj Jain
          </a>
        </div>
        <div className="w-full py-5"></div>
      </div>
    </div>
  )
}

export default MyApp
