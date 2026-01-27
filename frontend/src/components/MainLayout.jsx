import { Layout, Dropdown, Avatar, message } from 'antd'
import { UserOutlined, HeartOutlined, CalendarOutlined, CarOutlined, LogoutOutlined, DashboardOutlined, ProfileOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import useAuthStore from '../store/authStore'
import { authApi } from '../api/authApi'

const { Header, Content, Footer } = Layout
import UserProfileModal from './UserProfileModal'

export default function MainLayout({ children }) {
  const { isAuthenticated, user, role, clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const [showProfile, setShowProfile] = useState(false)

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.warn('Logout API call failed, clearing local session anyway.')
    } finally {
      clearAuth()
      message.success('Logged out successfully')
      navigate('/login')
    }
  }

  // Check for both 'ADMIN' (DB value) and 'ROLE_ADMIN' (Spring Security convention)
  const isAdmin = role === 'ADMIN' || role === 'ROLE_ADMIN'

  const userMenuItems = [
    // Conditionally render Admin Dashboard link
    ...(isAdmin
      ? [
          {
            key: 'admin',
            icon: <DashboardOutlined className="text-primary-500" />,
            label: (
              <Link to="/admin/dashboard" className="font-semibold text-primary-600 hover:text-primary-700">
                Admin Dashboard
              </Link>
            )
          },
          { type: 'divider' }
        ]
      : []),
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => setShowProfile(true)
    },
    {
      key: 'favorites',
      icon: <HeartOutlined />,
      label: <Link to="/favorites" className="hover:text-primary-600">My Favorites</Link>
    },
    {
      key: 'bookings',
      icon: <CalendarOutlined />,
      label: <Link to="/my-bookings" className="hover:text-primary-600">My Bookings</Link>
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ]

  return (
    <Layout className="min-h-screen bg-slate-50">
      <UserProfileModal 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)} 
      />
      {/* Enhanced Glassmorphism Sticky Header */}
      <Header className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between border-b border-white/30 shadow-[0_8px_32px_0_rgba(31,90,166,0.1)] backdrop-blur-2xl bg-white/80 backdrop-saturate-150 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="w-full max-w-[1400px] mx-auto flex items-center justify-between">
          {/* Modern Logo with Enhanced Gradient */}
          <Link to="/" className="no-underline group">
            <div className="flex items-center gap-3 transition-all duration-300 ease-out group-hover:scale-105">
              <div className="relative">
                {/* Animated Glow Effect */}
                <div className="absolute -inset-3 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                <CarOutlined className="relative text-4xl text-primary-600 drop-shadow-[0_2px_8px_rgba(31,90,166,0.3)] transition-all duration-300 group-hover:text-primary-500 group-hover:drop-shadow-[0_4px_16px_rgba(31,90,166,0.5)] group-hover:scale-110" />
              </div>
              <span className="text-3xl font-display font-extrabold tracking-tight leading-none">
                {/* Animated Multi-Color Gradient */}
                <span className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient drop-shadow-sm">
                  Auto
                </span>
                <span className="text-slate-900 drop-shadow-sm">Hub</span>
              </span>
            </div>
          </Link>

          {/* Enhanced Navigation */}
          <nav className="flex items-center gap-4 lg:gap-6">
            {/* Browse Inventory Button - Enhanced Hover */}
            <Link to="/cars" className="no-underline">
              <button className="relative px-5 py-2.5 text-slate-700 font-semibold rounded-xl hover:text-primary-700 transition-all duration-300 overflow-hidden group">
                {/* Animated background on hover */}
                <span className="absolute inset-0 bg-gradient-to-r from-primary-50 to-primary-100 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative flex items-center gap-2 group-hover:scale-105 transition-transform duration-200">
                  <CarOutlined className="text-base group-hover:rotate-6 transition-transform duration-300" />
                  Browse Inventory
                </span>
              </button>
            </Link>

            {/* Auth Section */}
            {isAuthenticated ? (
              <Dropdown 
                menu={{ items: userMenuItems }} 
                placement="bottomRight" 
                trigger={['click']}
                arrow
              >
                <div className="flex items-center gap-3 cursor-pointer px-4 py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 transition-all duration-300 group border border-transparent hover:border-slate-200 hover:shadow-md">
                  <Avatar
                    size={36}
                    className={`transition-all duration-300 ${
                      isAdmin 
                        ? 'bg-gradient-to-br from-primary-500 to-primary-600 ring-2 ring-primary-200 group-hover:ring-4 group-hover:ring-primary-300' 
                        : 'bg-gradient-to-br from-slate-600 to-slate-700 ring-2 ring-slate-300 group-hover:ring-4 group-hover:ring-slate-400'
                    } group-hover:scale-110 shadow-md`}
                    icon={<UserOutlined />}
                  />
                  <span className="text-slate-800 font-semibold group-hover:text-primary-700 transition-colors duration-200 hidden sm:inline">
                    {(() => {
                      if (user?.fullName && user.fullName.trim()) {
                        // Extract first name from full name
                        const firstName = user.fullName.trim().split(/\s+/)[0]
                        return firstName
                      }
                      return user?.email || 'User'
                    })()}
                  </span>
                </div>
              </Dropdown>
            ) : (
              <div className="flex items-center gap-3">
                {/* Log In Button - Enhanced */}
                <Link to="/login" className="no-underline">
                  <button className="px-5 py-2.5 text-slate-700 font-semibold rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-all duration-300 hover:shadow-sm border border-transparent hover:border-slate-200">
                    Log In
                  </button>
                </Link>
                <div className="w-px h-6 bg-slate-300 hidden sm:block" />
                {/* Register Button - Enhanced with Gradient */}
                <Link to="/register" className="no-underline">
                  <button className="relative px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgba(31,90,166,0.35)] hover:shadow-[0_6px_20px_0_rgba(31,90,166,0.45)] transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 overflow-hidden group">
                    <span className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative">Register</span>
                  </button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </Header>

      {/* Main Content - Optimized Responsive Padding */}
      <Content className="pt-24 sm:pt-28 pb-12 px-4 sm:px-6 lg:px-8 xl:px-12 bg-slate-50 min-h-screen">
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </Content>

      {/* Enhanced Modern Footer with Glassmorphism */}
      <Footer className="relative bg-gradient-to-b from-white via-slate-50 to-slate-100 border-t border-slate-200 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Footer Content Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 py-12">
            {/* Brand Section - Enhanced */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 group cursor-default">
                <div className="relative">
                  <div className="absolute -inset-2 bg-primary-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CarOutlined className="relative text-3xl text-primary-600 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="text-2xl font-display font-bold">
                  <span className="bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">Auto</span>
                  <span className="text-slate-900">Hub</span>
                </span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed max-w-xs">
                Your trusted car marketplace for finding quality vehicles and booking test drives instantly.
              </p>
              {/* Social Icons Placeholder */}
              <div className="flex items-center gap-3 pt-2">
                <div className="w-9 h-9 bg-slate-100 hover:bg-primary-50 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-md">
                  <span className="text-slate-600 hover:text-primary-600 transition-colors">📘</span>
                </div>
                <div className="w-9 h-9 bg-slate-100 hover:bg-primary-50 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-md">
                  <span className="text-slate-600 hover:text-primary-600 transition-colors">🐦</span>
                </div>
                <div className="w-9 h-9 bg-slate-100 hover:bg-primary-50 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-md">
                  <span className="text-slate-600 hover:text-primary-600 transition-colors">📷</span>
                </div>
              </div>
            </div>

            {/* Quick Links - Enhanced */}
            <div className="space-y-5">
              <h3 className="text-slate-900 font-bold text-sm uppercase tracking-wider">Quick Links</h3>
              <nav className="flex flex-col gap-3">
                <Link to="/cars" className="text-slate-600 hover:text-primary-600 transition-all duration-200 text-sm font-medium group flex items-center gap-2 hover:translate-x-1">
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full group-hover:bg-primary-500 transition-colors" />
                  Browse Inventory
                </Link>
                <Link to="/favorites" className="text-slate-600 hover:text-primary-600 transition-all duration-200 text-sm font-medium group flex items-center gap-2 hover:translate-x-1">
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full group-hover:bg-primary-500 transition-colors" />
                  My Favorites
                </Link>
                <Link to="/my-bookings" className="text-slate-600 hover:text-primary-600 transition-all duration-200 text-sm font-medium group flex items-center gap-2 hover:translate-x-1">
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full group-hover:bg-primary-500 transition-colors" />
                  My Bookings
                </Link>
              </nav>
            </div>

            {/* Contact Info - Enhanced */}
            <div className="space-y-5">
              <h3 className="text-slate-900 font-bold text-sm uppercase tracking-wider">Get In Touch</h3>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-3 group cursor-pointer hover:text-primary-600 transition-colors">
                  <span className="text-lg group-hover:scale-110 transition-transform">📧</span>
                  <span className="font-medium">support@autohub.com</span>
                </div>
                <div className="flex items-start gap-3 group cursor-pointer hover:text-primary-600 transition-colors">
                  <span className="text-lg group-hover:scale-110 transition-transform">📞</span>
                  <span className="font-medium">1-800-AUTO-HUB</span>
                </div>
                <div className="flex items-start gap-3 group cursor-pointer hover:text-primary-600 transition-colors">
                  <span className="text-lg group-hover:scale-110 transition-transform">📍</span>
                  <span className="font-medium">123 Car Street, Auto City</span>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright Bar - Enhanced */}
          <div className="border-t border-slate-200 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-slate-500 text-sm font-medium">
                © 2026 <span className="text-primary-600 font-semibold">AutoHub</span>. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-sm text-slate-500">
                <a href="#" className="hover:text-primary-600 transition-all duration-200 font-medium hover:underline hover:underline-offset-4">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-primary-600 transition-all duration-200 font-medium hover:underline hover:underline-offset-4">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-primary-600 transition-all duration-200 font-medium hover:underline hover:underline-offset-4">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </Footer>
    </Layout>
  )
}