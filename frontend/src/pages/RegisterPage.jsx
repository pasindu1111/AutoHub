import { Form, Input, message } from 'antd'
import { LockOutlined, MailOutlined, IdcardOutlined, CarOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api/authApi'

export default function RegisterPage() {
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const onFinish = async (values) => {
    try {
      const response = await authApi.register(values.fullName, values.email, values.password)

      if (response.success) {
        message.success('Registration successful! Please login.')
        navigate('/login')
      } else {
        message.error(response.message || 'Registration failed')
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Registration failed. Please try again.')
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
              Create Account
            </h1>
            <p className="text-slate-600 text-sm">
              Join AutoHub to start browsing quality vehicles
            </p>
          </div>

          {/* Registration Form */}
          <Form 
            form={form} 
            onFinish={onFinish} 
            layout="vertical" 
            requiredMark={false}
            className="space-y-4"
          >
            {/* Full Name Field */}
            <Form.Item
              name="fullName"
              label={<span className="text-sm font-semibold text-slate-700">Full Name</span>}
              rules={[{ required: true, message: 'Please enter your full name' }]}
            >
              <Input 
                prefix={<IdcardOutlined className="text-slate-400 mr-1" />} 
                placeholder="John Doe"
                className="h-12 px-4 rounded-xl border-slate-200 hover:border-primary-400 focus:border-primary-500 transition-colors"
              />
            </Form.Item>

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
                prefix={<MailOutlined className="text-slate-400 mr-1" />} 
                placeholder="you@example.com"
                className="h-12 px-4 rounded-xl border-slate-200 hover:border-primary-400 focus:border-primary-500 transition-colors"
              />
            </Form.Item>

            {/* Password Field */}
            <Form.Item
              name="password"
              label={<span className="text-sm font-semibold text-slate-700">Password</span>}
              rules={[
                { required: true, message: 'Please enter a password' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined className="text-slate-400 mr-1" />} 
                placeholder="Create a strong password"
                className="h-12 px-4 rounded-xl border-slate-200 hover:border-primary-400 focus:border-primary-500 transition-colors"
              />
            </Form.Item>

            {/* Confirm Password Field */}
            <Form.Item
              name="confirmPassword"
              label={<span className="text-sm font-semibold text-slate-700">Confirm Password</span>}
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('Passwords do not match'))
                  }
                })
              ]}
            >
              <Input.Password 
                prefix={<CheckCircleOutlined className="text-slate-400 mr-1" />} 
                placeholder="Confirm your password"
                className="h-12 px-4 rounded-xl border-slate-200 hover:border-primary-400 focus:border-primary-500 transition-colors"
              />
            </Form.Item>

            {/* Submit Button with Gradient */}
            <button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-200 hover:-translate-y-0.5 mt-6"
            >
              Create Account
            </button>
          </Form>

          {/* Benefits Section */}
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs font-semibold text-slate-600 mb-2">What you'll get:</p>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircleOutlined className="text-green-500 mt-0.5" />
                <span>Access to our entire inventory</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleOutlined className="text-green-500 mt-0.5" />
                <span>Book test drives instantly</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleOutlined className="text-green-500 mt-0.5" />
                <span>Save your favorite vehicles</span>
              </li>
            </ul>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-slate-500 font-medium">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <Link to="/login" className="no-underline">
              <button className="w-full h-12 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-200">
                Sign In Instead
              </button>
            </Link>
          </div>
        </div>

        {/* Additional Help Text */}
        <p className="text-center text-sm text-slate-500 mt-6">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
            Terms
          </a>
          {' '}and{' '}
          <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}
