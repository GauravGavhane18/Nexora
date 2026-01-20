import React from 'react'

const SkeletonCard = () => {
    return (
        <div className="bg-white border rounded-xl shadow-md overflow-hidden animate-pulse">
            {/* Image Skeleton */}
            <div className="h-48 bg-gray-200 w-full"></div>

            {/* Content Skeleton */}
            <div className="p-4">
                {/* Title Skeleton */}
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>

                {/* Price & Button Skeleton */}
                <div className="flex items-center justify-between mt-4">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
            </div>
        </div>
    )
}

export default SkeletonCard
