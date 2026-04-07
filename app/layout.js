import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { Toaster } from 'sonner'

export const metadata = {
  title: 'KalaSarthi - AI-Powered Artisan Marketplace',
  description: 'Connect with Indian artisans and discover authentic handcrafted products powered by AI',
  keywords: 'Indian artisans, handicrafts, handmade, marketplace, KalaSarthi',
  openGraph: {
    title: 'KalaSarthi - AI-Powered Artisan Marketplace',
    description: 'Connect with Indian artisans and discover authentic handcrafted products',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
        {/* Chunk load error handler - auto-reload on chunk failure */}
        <script dangerouslySetInnerHTML={{__html:`
          window.addEventListener('error', function(e) {
            if (e.message && e.message.includes('ChunkLoadError')) {
              console.warn('Chunk load failed, reloading...');
              window.location.reload();
            }
          });
        `}} />
        {/* Leaflet CSS */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        {/* Razorpay Setup */}
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body className="antialiased">
        <AuthProvider>
          <LanguageProvider>
            {children}
            <Toaster position="top-right" richColors />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
