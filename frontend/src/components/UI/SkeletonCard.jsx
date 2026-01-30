import React from 'react'

const SkeletonCard = () => {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
            {/* Image Skeleton - Matching aspect-[4/5] */}
            <div className="aspect-[4/5] bg-gray-200 w-full"></div>

            {/* Content Skeleton */}
            <div className="p-5">
                {/* Title Skeleton */}
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>

                {/* Price & Button Skeleton */}
                <div className="flex items-center justify-between">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
            </div>
        </div>
    )
}

export default SkeletonCard
