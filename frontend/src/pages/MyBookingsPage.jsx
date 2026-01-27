import { useState, useEffect } from 'react'
import { Table, Typography, Tag, Spin, message, Card, Button, Popconfirm, Space } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { testDriveApi } from '../api/testDriveApi'
import dayjs from 'dayjs'

const { Title, Text } = Typography

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const response = await testDriveApi.getMyBookings()
      if (response.success && response.data) {
        setBookings(response.data)
      }
    } catch (error) {
      message.error('Failed to load bookings')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id) => {
    setCancelling(id)
    try {
      const response = await testDriveApi.cancelBooking(id)
      if (response.success) {
        message.success('Booking cancelled successfully')
        fetchBookings() // Refresh list
      } else {
        message.error(response.message || 'Failed to cancel booking')
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to cancel booking')
    } finally {
      setCancelling(null)
    }
  }

  const columns = [
    {
      title: 'Vehicle',
      key: 'car',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.carMake} {record.carModel}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>ID: {record.carId}</Text>
        </Space>
      )
    },
    {
      title: 'Appointment Date',
      dataIndex: 'appointmentDate',
      key: 'appointmentDate',
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm')
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const colors = {
          PENDING: 'blue',
          APPROVED: 'green',
          REJECTED: 'red',
          COMPLETED: 'purple',
          CANCELLED: 'orange'
        }
        return <Tag color={colors[status] || 'default'}>{status}</Tag>
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) =>
        record.status === 'PENDING' ? (
          <Popconfirm
            title="Cancel this booking?"
            description="This action cannot be undone."
            onConfirm={() => handleCancel(record.id)}
            okText="Yes, cancel"
            cancelText="No"
          >
            <Button
              danger
              size="small"
              icon={<CloseCircleOutlined />}
              loading={cancelling === record.id}
            >
              Cancel
            </Button>
          </Popconfirm>
        ) : (
          <Text type="secondary">-</Text>
        )
    }
  ]

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 0' }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Title level={2} style={{ marginBottom: 32 }}>
        My Test Drive Bookings
      </Title>

      <Card>
        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: "You haven't booked any test drives yet"
          }}
        />
      </Card>
    </motion.div>
  )
}
