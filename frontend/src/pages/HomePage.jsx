import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button, Select, Input } from 'antd'
import { SearchOutlined, CarOutlined, DollarOutlined, CalendarOutlined } from '@ant-design/icons'
import FeaturedVehicles from '../components/FeaturedVehicles'

const { Option } = Select

export default function HomePage() {
  const navigate = useNavigate()
  const [searchFilters, setSearchFilters] = useState({
    make: '',
    priceRange: '',
    year: ''
  })

  const handleQuickSearch = () => {
    const params = new URLSearchParams()
    if (searchFilters.make) params.append('make', searchFilters.make)
    if (searchFilters.year) params.append('yearMin', searchFilters.year)
    navigate(`/cars?${params.toString()}`)
  }

  return (
    <>
      {/* High-Impact Hero Section with Dark Overlay */}
      <div className="relative -mt-24 pt-24">
        {/* Background Image with Overlay */}
        <div 
          className="relative h-[600px] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80')`
          }}
        >
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-primary-900/70 backdrop-blur-[2px]" />
          
          {/* Animated Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />

          {/* Hero Content */}
          <div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              {/* Eyebrow Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium"
              >
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Premium Car Marketplace
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold text-white mb-6 leading-tight"
              >
                Find Your
                <span className="block bg-gradient-to-r from-primary-400 via-primary-300 to-primary-500 bg-clip-text text-transparent">
                  Dream Car
                </span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl sm:text-2xl text-slate-200 mb-12 leading-relaxed max-w-2xl mx-auto"
              >
                Browse through our extensive collection of quality vehicles and book test drives instantly
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
              >
                <Link to="/cars" className="no-underline">
                  <button className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold rounded-xl shadow-[0_8px_30px_rgba(31,90,166,0.4)] hover:shadow-[0_12px_40px_rgba(31,90,166,0.5)] transition-all duration-300 hover:scale-105 hover:-translate-y-1 text-lg min-w-[180px]">
                    Browse Cars
                  </button>
                </Link>
                <Link to="/register" className="no-underline">
                  <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105 text-lg min-w-[180px]">
                    Get Started
                  </button>
                </Link>
              </motion.div>

              {/* Quick Search Floating Bar */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="max-w-5xl mx-auto"
              >
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 sm:p-8">
                  <div className="flex flex-col lg:flex-row items-stretch gap-4">
                    {/* Make Selection */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 text-slate-700">
                        <CarOutlined className="text-primary-600" />
                        <span className="text-sm font-semibold">Make</span>
                      </div>
                      <Select
                        placeholder="Select Make"
                        size="large"
                        className="w-full"
                        onChange={(value) => setSearchFilters({ ...searchFilters, make: value })}
                        allowClear
                      >
                        <Option value="Toyota">Toyota</Option>
                        <Option value="Honda">Honda</Option>
                        <Option value="Ford">Ford</Option>
                        <Option value="BMW">BMW</Option>
                        <Option value="Mercedes-Benz">Mercedes-Benz</Option>
                        <Option value="Audi">Audi</Option>
                        <Option value="Tesla">Tesla</Option>
                        <Option value="Chevrolet">Chevrolet</Option>
                      </Select>
                    </div>

                    {/* Year Selection */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 text-slate-700">
                        <CalendarOutlined className="text-primary-600" />
                        <span className="text-sm font-semibold">Year</span>
                      </div>
                      <Select
                        placeholder="Select Year"
                        size="large"
                        className="w-full"
                        onChange={(value) => setSearchFilters({ ...searchFilters, year: value })}
                        allowClear
                      >
                        {Array.from({ length: 10 }, (_, i) => {
                          const year = new Date().getFullYear() - i
                          return <Option key={year} value={year}>{year}</Option>
                        })}
                      </Select>
                    </div>

                    {/* Price Range */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 text-slate-700">
                        <DollarOutlined className="text-primary-600" />
                        <span className="text-sm font-semibold">Price Range</span>
                      </div>
                      <Select
                        placeholder="Select Range"
                        size="large"
                        className="w-full"
                        onChange={(value) => setSearchFilters({ ...searchFilters, priceRange: value })}
                        allowClear
                      >
                        <Option value="0-20000">Under $20,000</Option>
                        <Option value="20000-40000">$20,000 - $40,000</Option>
                        <Option value="40000-60000">$40,000 - $60,000</Option>
                        <Option value="60000-100000">$60,000 - $100,000</Option>
                        <Option value="100000-999999">Over $100,000</Option>
                      </Select>
                    </div>

                    {/* Search Button */}
                    <div className="flex items-end">
                      <button
                        onClick={handleQuickSearch}
                        className="w-full lg:w-auto px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        <SearchOutlined className="text-lg" />
                        Search Cars
                      </button>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200">
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-primary-600">500+</div>
                      <div className="text-xs sm:text-sm text-slate-600 font-medium">Available Cars</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-primary-600">50+</div>
                      <div className="text-xs sm:text-sm text-slate-600 font-medium">Car Brands</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-primary-600">1000+</div>
                      <div className="text-xs sm:text-sm text-slate-600 font-medium">Happy Customers</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Featured Vehicles Section - Enhanced */}
      <div className="my-16 sm:my-20">
        <FeaturedVehicles />
      </div>
    </>
  )
}
