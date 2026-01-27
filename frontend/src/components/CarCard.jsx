import { EyeOutlined, HeartOutlined, HeartFilled, CarOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { getImageUrl } from '../utils/imageUtils'

export default function CarCard({ car, onFavorite }) {
  const [isFavorited, setIsFavorited] = useState(false)
  const imageUrl = getImageUrl(car.primaryImage)

  const handleFavoriteClick = () => {
    if (onFavorite) {
      onFavorite(car.id)
      setIsFavorited(!isFavorited)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      {/* Card Container with Tailwind Styling */}
      <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col border-0 hover:-translate-y-1">
        {/* Car Image Section */}
        <div className="relative h-60 overflow-hidden">
          {imageUrl ? (
            <div
              className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-slate-100">
              <CarOutlined className="text-6xl text-slate-300" />
            </div>
          )}
          
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Status Badge */}
          {car.status && (
            <div className="absolute top-3 right-3">
              <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 ${
                car.status === 'AVAILABLE' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-slate-400 text-white'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  car.status === 'AVAILABLE' ? 'bg-white animate-pulse' : 'bg-slate-200'
                }`} />
                {car.status}
              </div>
            </div>
          )}

          {/* Favorite Button Overlay */}
          {onFavorite && (
            <button
              onClick={handleFavoriteClick}
              className="absolute top-3 left-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 group/fav"
            >
              {isFavorited ? (
                <HeartFilled className="text-red-500 text-xl" />
              ) : (
                <HeartOutlined className="text-slate-600 group-hover/fav:text-red-500 text-xl transition-colors" />
              )}
            </button>
          )}
        </div>

        {/* Card Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Car Title & Year */}
          <div className="mb-3">
            <Link to={`/cars/${car.id}`} className="no-underline">
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors mb-1 leading-tight">
                {car.make} {car.model}
              </h3>
            </Link>
            <p className="text-sm text-slate-500 font-medium">{car.year}</p>
          </div>

          {/* Badge-Style Spec Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {/* Transmission Badge */}
            <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold">
              <span className="mr-1.5">⚙️</span>
              {car.transmission}
            </span>
            
            {/* Fuel Type Badge */}
            <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold">
              <span className="mr-1.5">⛽</span>
              {car.fuelType}
            </span>
          </div>

          {/* Description (if available) */}
          {car.description && (
            <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
              {car.description}
            </p>
          )}

          {/* Mileage (if available) */}
          {car.mileage && (
            <div className="mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="text-base">🏁</span>
                <span className="font-medium">{car.mileage.toLocaleString()} miles</span>
              </div>
            </div>
          )}

          {/* Price Section - Bold and Prominent */}
          <div className="mt-auto pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 mb-0.5 font-medium uppercase tracking-wide">Price</p>
                <p className="text-3xl font-extrabold text-primary-600 leading-none">
                  ${car.price.toLocaleString()}
                </p>
              </div>
              
              {/* View Details Button */}
              <Link to={`/cars/${car.id}`}>
                <button className="flex items-center justify-center w-11 h-11 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-600 hover:text-white transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md group/btn">
                  <EyeOutlined className="text-lg group-hover/btn:scale-110 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
          <Link to={`/cars/${car.id}`} className="no-underline">
            <button className="w-full py-2.5 text-primary-600 font-semibold text-sm rounded-lg hover:bg-primary-50 transition-all duration-200 flex items-center justify-center gap-2 group/action">
              <EyeOutlined className="text-base group-hover/action:translate-x-0.5 transition-transform" />
              View Full Details
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
