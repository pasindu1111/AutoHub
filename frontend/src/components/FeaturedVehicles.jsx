import { useState, useEffect } from 'react'
import { Spin, Tag } from 'antd'
import { EyeOutlined, CarOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { carsApi } from '../api/carsApi'
import { getImageUrl } from '../utils/imageUtils'

export default function FeaturedVehicles() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCars = async () => {
      try {
        // Request only 6 cars for featured section
        const response = await carsApi.getPublicCars({}, { page: 0, size: 6 })
        if (response.success && response.data) {
          // Backend returns PagedResponse with content array
          setCars(response.data.content || [])
        }
      } catch (error) {
        console.error('Failed to fetch cars:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-16">
        <Spin size="large" />
        <p className="text-slate-600 mt-4 text-lg">Loading featured vehicles...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-primary-50 rounded-full">
          <ThunderboltOutlined className="text-primary-600" />
          <span className="text-primary-700 font-semibold text-sm">Featured Collection</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-slate-900 mb-4">
          Featured <span className="text-gradient bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">Vehicles</span>
        </h2>
        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
          Explore our handpicked selection of quality cars ready for test drive
        </p>
      </motion.div>

      {/* Enhanced Grid with gap-8 and fade-in-up animation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {cars.map((car, index) => (
          <motion.div
            key={car.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="group bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden h-full flex flex-col hover:-translate-y-2">
              {/* Car Image */}
              <div className="relative h-64 overflow-hidden">
                {car.primaryImage ? (
                  <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${getImageUrl(car.primaryImage)})`
                    }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-slate-100">
                    <CarOutlined className="text-6xl text-slate-300" />
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                  <Link to={`/cars/${car.id}`}>
                    <button className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl shadow-lg hover:bg-primary-50 transition-all duration-200 flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0">
                      <EyeOutlined className="text-lg" />
                      View Details
                    </button>
                  </Link>
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <div className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    Available
                  </div>
                </div>
              </div>

              {/* Car Details */}
              <div className="p-6 flex-1 flex flex-col">
                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {car.make} {car.model}
                </h3>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-semibold border border-primary-100">
                    {car.year}
                  </span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
                    {car.transmission}
                  </span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
                    {car.fuelType}
                  </span>
                </div>

                {/* Specs Grid */}
                {car.mileage && (
                  <div className="mb-4 pb-4 border-b border-slate-100">
                    <div className="text-sm text-slate-600">
                      <span className="font-medium">Mileage:</span> {car.mileage?.toLocaleString()} miles
                    </div>
                  </div>
                )}

                {/* Price */}
                <div className="mt-auto">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Starting at</p>
                      <p className="text-3xl font-bold text-primary-600">
                        ${car.price.toLocaleString()}
                      </p>
                    </div>
                    <Link to={`/cars/${car.id}`}>
                      <button className="w-10 h-10 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all duration-200 hover:scale-110">
                        <EyeOutlined className="text-lg" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View All Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <Link to="/cars" className="no-underline">
          <button className="px-10 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold rounded-xl shadow-[0_8px_30px_rgba(31,90,166,0.3)] hover:shadow-[0_12px_40px_rgba(31,90,166,0.4)] transition-all duration-300 hover:scale-105 hover:-translate-y-1 text-lg inline-flex items-center gap-3 group">
            View All Cars
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </button>
        </Link>
      </motion.div>
    </div>
  )
}
