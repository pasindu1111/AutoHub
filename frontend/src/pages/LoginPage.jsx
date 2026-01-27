import { Form, Input, App } from 'antd'
import { UserOutlined, LockOutlined, CarOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api/authApi'
import useAuthStore from '../store/authStore'

export default function LoginPage() {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const { message } = App.useApp()

  const onFinish = async (values) => {
    try {
      // 1. Perform login to set HttpOnly cookies (JWT)
      const loginResponse = await authApi.login(values.email, values.password)
      
      if (loginResponse.success) {
        // 2. Immediately fetch the real profile to get the Role from Database
        try {
          const userResponse = await authApi.getCurrentUser()
          
          if (userResponse.success && userResponse.data) {
            const { email, fullName, role } = userResponse.data
            
            // 3. Update Global Auth Store with full user data including fullName
            setAuth({ email, fullName }, role)
            
            message.success('Login successful!')

            // 4. Role-Based Redirection (Issue #8 Fix)
            if (role === 'ROLE_ADMIN' || role === 'ADMIN') {
              navigate('/admin/dashboard')
            } else {
              navigate('/')
            }
          } else {
            message.error('Failed to retrieve user profile data')
          }
        } catch (profileError) {
          console.error("Profile Fetch Error:", profileError)
          message.error('Authenticated, but could not load user role.')
        }
      } else {
        message.error(loginResponse.message || 'Invalid email or password')
      }
    } catch (error) {
      console.error("Login Error:", error)
      message.error(
        error.response?.data?.message || 'Connection failed. Is the backend running?'
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Centered Card Container */}
      <div className="w-full max-w-md">
        {/* Card with Soft Border and Clean Design */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-8 sm:p-10">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-4 shadow-lg">
              <CarOutlined className="text-3xl text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-600 text-sm">
              Sign in to your AutoHub account
            </p>
          </div>

          {/* Login Form */}
          <Form 
            form={form} 
            onFinish={onFinish} 
            layout="vertical" 
            requiredMark={false}
            className="space-y-5"
          >
            {/* Email Field */}
            <Form.Item
              name="email"
              label={<span className="text-sm font-semibold text-slate-700">Email Address</span>}
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input 
                prefix={<UserOutlined className="text-slate-400 mr-1" />} 
                placeholder="you@example.com"
                className="h-12 px-4 rounded-xl border-slate-200 hover:border-primary-400 focus:border-primary-500 transition-colors"
              />
            </Form.Item>

            {/* Password Field */}
            <Form.Item
              name="password"
              label={<span className="text-sm font-semibold text-slate-700">Password</span>}
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password 
                prefix={<LockOutlined className="text-slate-400 mr-1" />} 
                placeholder="Enter your password"
                className="h-12 px-4 rounded-xl border-slate-200 hover:border-primary-400 focus:border-primary-500 transition-colors"
              />
            </Form.Item>

            {/* Submit Button with Gradient */}
            <button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-200 hover:-translate-y-0.5 mt-6"
            >
              Sign In
            </button>
          </Form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-slate-500 font-medium">
                Don't have an account?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <Link to="/register" className="no-underline">
              <button className="w-full h-12 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-200">
                Create Account
              </button>
            </Link>
          </div>
        </div>

        {/* Additional Help Text */}
        <p className="text-center text-sm text-slate-500 mt-6">
          By signing in, you agree to our{' '}
          <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
            Terms of Service
          </a>
        </p>
      </div>
    </div>
  )
}