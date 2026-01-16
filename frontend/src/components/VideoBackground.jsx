import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const VideoBackground = ({ videoUrl, fallbackImage, children, overlay = true }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Video Background */}
      {!hasError && videoUrl && (
        <video
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          onError={() => setHasError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}

      {/* Fallback Image */}
      {(hasError || !videoUrl) && fallbackImage && (
        <img
          src={fallbackImage}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
      )}

      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  )
}

export default VideoBackground
