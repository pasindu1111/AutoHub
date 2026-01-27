import { Modal, Form, Input, Button, message } from 'antd'
import { UserOutlined, MailOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import useAuthStore from '../store/authStore'
import { authApi } from '../api/authApi'

export default function UserProfileModal({ isOpen, onClose }) {
  const { user, updateUser } = useAuthStore()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && user) {
      form.setFieldsValue({
        email: user.email,
        fullName: user.fullName
      })
    }
  }, [isOpen, user, form])

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      // Assuming authApi has a generic patch method or we add a specific one
      const response = await authApi.updateProfile({ fullName: values.fullName })
      
      // Update local state with new user details
      updateUser({ fullName: response.data.fullName })
      
      message.success('Profile updated successfully')
      onClose()
    } catch (error) {
      console.error('Update failed:', error)
      message.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-primary-700">
          <UserOutlined />
          <span>Edit Profile</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      maskClosable={false}
      className="profile-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
      >
        <Form.Item
          label="Email Address"
          name="email"
        >
          <Input 
            prefix={<MailOutlined className="text-slate-400" />} 
            disabled 
            className="bg-slate-50 text-slate-500"
          />
        </Form.Item>

        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[
            { required: true, message: 'Please enter your full name' },
            { min: 2, message: 'Name must be at least 2 characters' }
          ]}
        >
          <Input 
            prefix={<UserOutlined className="text-primary-400" />} 
            placeholder="Enter your full name" 
          />
        </Form.Item>

        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            className="bg-primary-600 hover:bg-primary-500"
          >
            Save Changes
          </Button>
        </div>
      </Form>
    </Modal>
  )
}
