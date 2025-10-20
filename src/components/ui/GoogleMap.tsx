'use client'

import { useCallback, useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

// Lazy load Google Maps components
const DynamicGoogleMap = dynamic(
  () => import('@react-google-maps/api').then(mod => ({ 
    default: ({ children, ...props }: any) => (
      <mod.GoogleMap {...props}>{children}</mod.GoogleMap>
    )
  })),
  { ssr: false }
)

const LoadScript = dynamic(
  () => import('@react-google-maps/api').then(mod => ({ default: mod.LoadScript })),
  { ssr: false }
)

const Marker = dynamic(
  () => import('@react-google-maps/api').then(mod => ({ default: mod.Marker })),
  { ssr: false }
)

const mapContainerStyle = {
  width: '100%',
  height: '300px'
}

const center = {
  lat: 35.45816515779981,
  lng: 139.63248232558916
}

const options = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: true,
  rotateControl: false,
  fullscreenControl: true,
  styles: [
    {
      elementType: "geometry",
      stylers: [
        {
          color: "#1d1d1d"
        }
      ]
    },
    {
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#8ec3b9"
        }
      ]
    },
    {
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#1a3646"
        }
      ]
    },
    {
      featureType: "administrative.country",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#4b6878"
        }
      ]
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#64779e"
        }
      ]
    },
    {
      featureType: "administrative.province",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#4b6878"
        }
      ]
    },
    {
      featureType: "landscape.man_made",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#334e87"
        }
      ]
    },
    {
      featureType: "landscape.natural",
      elementType: "geometry",
      stylers: [
        {
          color: "#023e58"
        }
      ]
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [
        {
          color: "#283d6a"
        }
      ]
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#6f9ba5"
        }
      ]
    },
    {
      featureType: "poi",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#1d2c4d"
        }
      ]
    },
    {
      featureType: "poi.park",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#023e58"
        }
      ]
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#3C7680"
        }
      ]
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        {
          color: "#304a7d"
        }
      ]
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#98a5be"
        }
      ]
    },
    {
      featureType: "road",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#1d2c4d"
        }
      ]
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [
        {
          color: "#2c6675"
        }
      ]
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#255763"
        }
      ]
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#b0d5ce"
        }
      ]
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#023e58"
        }
      ]
    },
    {
      featureType: "transit",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#98a5be"
        }
      ]
    },
    {
      featureType: "transit",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#1d2c4d"
        }
      ]
    },
    {
      featureType: "transit.line",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#283d6a"
        }
      ]
    },
    {
      featureType: "transit.station",
      elementType: "geometry",
      stylers: [
        {
          color: "#3a4762"
        }
      ]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: "#0e1626"
        }
      ]
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#4e6d70"
        }
      ]
    }
  ]
}

interface GoogleMapComponentProps {
  apiKey: string
}

export function GoogleMapComponent({ apiKey }: GoogleMapComponentProps) {
  const [mapRef, isVisible] = useIntersectionObserver({ 
    threshold: 0.1,
    rootMargin: '50px'
  })
  const [_map, setMap] = useState<google.maps.Map | null>(null)
  const [showMap, setShowMap] = useState(false)

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  // Only load Google Maps when visible and user interacts
  const handleLoadMap = () => {
    setShowMap(true)
  }

  return (
    <div ref={mapRef} style={mapContainerStyle} className="relative">
      {!showMap ? (
        <div 
          className="w-full h-full bg-gray-800 flex items-center justify-center cursor-pointer rounded-lg border border-yellow-400/20"
          onClick={handleLoadMap}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📍</span>
            </div>
            <p className="text-white mb-2">地図を読み込む</p>
            <p className="text-gray-400 text-sm">クリックして表示</p>
          </div>
        </div>
      ) : (
        <Suspense fallback={
          <div className="w-full h-full bg-gray-800 flex items-center justify-center animate-pulse">
            <span className="text-gray-400">地図を読み込み中...</span>
          </div>
        }>
          <LoadScript googleMapsApiKey={apiKey} id="google-maps-script">
            <DynamicGoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={16}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={options}
            >
              <Marker 
                position={center}
                title="NonTurn.LLC - オーシャンゲートみなとみらい8F"
              />
            </DynamicGoogleMap>
          </LoadScript>
        </Suspense>
      )}
    </div>
  )
}

// Fallback component for when API key is not available
export function MapFallback() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-yellow-400/20 bg-gray-900/50 h-[300px] flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-400 mb-4">地図を表示できません</p>
        <a 
          href="https://goo.gl/maps/5xKZqBWxPnLNDkb6A"
          target="_blank"
          rel="noopener noreferrer"
          className="text-yellow-400 hover:text-yellow-300 underline"
        >
          Google Mapsで開く
        </a>
      </div>
    </div>
  )
}