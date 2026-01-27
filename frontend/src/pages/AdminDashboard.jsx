import { useState, useEffect } from 'react'
import {
  Tabs,
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Modal,
  Input,
  Select
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  RedoOutlined,
  MailOutlined,
  PictureOutlined,
  CarOutlined,
  CalendarOutlined,
  DollarOutlined,
  RiseOutlined,
  TrophyOutlined,
  ThunderboltOutlined
} from '@ant-design/icons'
import AddEditCarDrawer from '../components/AddEditCarDrawer'
import ManageCarImagesModal from '../components/ManageCarImagesModal'
import { adminCarsApi } from '../api/adminCarsApi'
import { adminTestDriveApi } from '../api/adminTestDriveApi'
import dayjs from 'dayjs'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('inventory')
  const [cars, setCars] = useState([])
  const [testDrives, setTestDrives] = useState([])
  const [loading, setLoading] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedCar, setSelectedCar] = useState(null)
  const [imagesModalOpen, setImagesModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [selectedTestDrive, setSelectedTestDrive] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => {
    if (activeTab === 'inventory') {
      fetchCars()
    } else if (activeTab === 'test-drives') {
      fetchTestDrives()
    }
  }, [activeTab])

  const fetchCars = async () => {
    setLoading(true)
    try {
      const response = await adminCarsApi.getAllCars()
      if (response.success) {
        setCars(response.data)
      }
    } catch (error) {
      message.error('Failed to load cars')
    } finally {
      setLoading(false)
    }
  }

  const fetchTestDrives = async () => {
    setLoading(true)
    try {
      const response = await adminTestDriveApi.getAllTestDrives()
      if (response.success) {
        setTestDrives(response.data)
      }
    } catch (error) {
      message.error('Failed to load test drives')
    } finally {
      setLoading(false)
    }
  }

  const handleAddCar = () => {
    setSelectedCar(null)
    setDrawerOpen(true)
  }

  const handleEditCar = (car) => {
    setSelectedCar(car)
    setDrawerOpen(true)
  }

  const handleManageImages = (car) => {
    setSelectedCar(car)
    setImagesModalOpen(true)
  }

  const handleDeleteCar = async (id) => {
    try {
      await adminCarsApi.deleteCar(id)
      message.success('Car soft-deleted successfully')
      fetchCars()
    } catch (error) {
      message.error('Failed to delete car')
    }
  }

  const handleRestoreCar = async (id) => {
    try {
      await adminCarsApi.restoreCar(id)
      message.success('Car restored to inventory')
      fetchCars()
    } catch (error) {
      message.error('Failed to restore car')
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminCarsApi.updateStatus(id, newStatus)
      message.success(`Car status changed to ${newStatus}`)
      fetchCars()
    } catch (error) {
      message.error('Failed to update car status')
    }
  }

  const handleApproveTestDrive = async (id) => {
    try {
      await adminTestDriveApi.updateStatus(id, 'APPROVED')
      message.success('Test drive approved - Notification sent to customer')
      fetchTestDrives()
    } catch (error) {
      message.error('Failed to approve test drive')
    }
  }

  const handleRejectTestDrive = () => {
    if (selectedTestDrive) {
      adminTestDriveApi
        .updateStatus(selectedTestDrive.id, 'REJECTED')
        .then(() => {
          message.success('Test drive rejected')
          fetchTestDrives()
          setRejectModalOpen(false)
          setRejectReason('')
          setSelectedTestDrive(null)
        })
        .catch(() => {
          message.error('Failed to reject test drive')
        })
    }
  }

  // Calculate stats
  const totalCars = cars.filter(car => !car.deleted).length
  const availableCars = cars.filter(car => car.status === 'AVAILABLE' && !car.deleted).length
  const activeBookings = testDrives.filter(td => td.status === 'PENDING' || td.status === 'APPROVED').length
  const totalRevenue = cars
    .filter(car => car.status === 'SOLD')
    .reduce((sum, car) => sum + car.price, 0)

  const carColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      render: (id) => (
        <span className="text-slate-500 font-mono text-xs">#{id}</span>
      )
    },
    {
      title: 'Vehicle',
      key: 'car',
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900">{`${record.make} ${record.model}`}</span>
          <span className="text-xs text-slate-500">{record.year}</span>
        </div>
      )
    },
    {
      title: 'Price',
      key: 'price',
      render: (_, record) => (
        <span className="font-bold text-primary-600">
          ${record.price.toLocaleString()}
        </span>
      ),
      width: 130
    },
    {
      title: 'Listing Status',
      dataIndex: 'status',
      key: 'status',
      width: 200,
      render: (status, record) => 
        !record.deleted ? (
          <Select
            value={status}
            onChange={(newStatus) => handleStatusChange(record.id, newStatus)}
            className="w-40"
            size="small"
          >
            <Select.Option value="AVAILABLE">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Available
              </span>
            </Select.Option>
            <Select.Option value="SOLD">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                Sold
              </span>
            </Select.Option>
          </Select>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-600">
            Archived
          </span>
        )
    },
    {
      title: 'Visibility',
      key: 'deleted',
      width: 120,
      render: (_, record) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
          record.deleted 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {record.deleted ? <CloseOutlined className="text-xs" /> : <CheckOutlined className="text-xs" />}
          {record.deleted ? 'Deleted' : 'Active'}
        </span>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 280,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          {!record.deleted ? (
            <>
              <button
                onClick={() => handleEditCar(record)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
              >
                <EditOutlined className="text-sm" />
                Edit
              </button>
              <button
                onClick={() => handleManageImages(record)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 hover:border-primary-300 transition-all duration-200"
              >
                <PictureOutlined className="text-sm" />
                Images
              </button>
              <Popconfirm
                title="Delete listing?"
                description="This will hide the car from public view."
                onConfirm={() => handleDeleteCar(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200">
                  <DeleteOutlined className="text-sm" />
                  Delete
                </button>
              </Popconfirm>
            </>
          ) : (
            <button
              onClick={() => handleRestoreCar(record.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 hover:border-primary-300 transition-all duration-200"
            >
              <RedoOutlined className="text-sm" />
              Restore Listing
            </button>
          )}
        </div>
      )
    }
  ]

  const testDriveColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      render: (id) => (
        <span className="text-slate-500 font-mono text-xs">#{id}</span>
      )
    },
    {
      title: 'Vehicle',
      key: 'car',
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900">{record.carMake} {record.carModel}</span>
          <span className="text-xs text-slate-500">Car ID: {record.carId}</span>
        </div>
      )
    },
    {
      title: 'Appointment Details',
      key: 'appointment',
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900">{dayjs(record.appointmentDate).format('MMMM D, YYYY')}</span>
          <span className="text-xs text-slate-500">{dayjs(record.appointmentDate).format('h:mm A')}</span>
        </div>
      )
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900">{record.customerName}</span>
          <span className="text-xs text-slate-500">{record.customerEmail}</span>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const config = {
          PENDING: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Pending' },
          APPROVED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
          REJECTED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
          COMPLETED: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Completed' }
        }
        const style = config[status] || { bg: 'bg-slate-100', text: 'text-slate-800', label: status }
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
            {style.label}
          </span>
        )
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 220,
      render: (_, record) =>
        record.status === 'PENDING' ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleApproveTestDrive(record.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 transition-all duration-200"
            >
              <CheckOutlined className="text-sm" />
              Approve
            </button>
            <button
              onClick={() => {
                setSelectedTestDrive(record)
                setRejectModalOpen(true)
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200"
            >
              <CloseOutlined className="text-sm" />
              Reject
            </button>
          </div>
        ) : (
          <span className="text-xs text-slate-400 font-medium">Processed</span>
        )
    }
  ]

  const tabItems = [
    {
      key: 'inventory',
      label: (
        <span className="inline-flex items-center gap-2 px-1">
          <CarOutlined />
          Inventory Management
        </span>
      ),
      children: (
        <div className="py-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-600">Manage your vehicle listings and availability.</p>
            <button 
              onClick={handleAddCar}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <PlusOutlined />
              Add New Vehicle
            </button>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <Table
              columns={carColumns}
              dataSource={cars}
              rowKey="id"
              loading={loading}
              pagination={{ 
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} vehicles`
              }}
              className="admin-table"
            />
          </div>
        </div>
      )
    },
    {
      key: 'test-drives',
      label: (
        <span className="inline-flex items-center gap-2 px-1">
          <CalendarOutlined />
          Test Drive Requests
        </span>
      ),
      children: (
        <div className="py-6">
          <div className="mb-6 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
            <MailOutlined className="text-blue-600" />
            <span className="text-sm text-blue-800 font-medium">
              Automated customer emails are active for all status changes.
            </span>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <Table
              columns={testDriveColumns}
              dataSource={testDrives}
              rowKey="id"
              loading={loading}
              pagination={{ 
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} bookings`
              }}
              className="admin-table"
            />
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 border border-primary-200 rounded-lg">
              <TrophyOutlined className="text-primary-600" />
              <span className="text-sm font-semibold text-primary-700">Admin Panel</span>
            </div>
          </div>
          <p className="text-slate-600">Manage your inventory, bookings, and customer interactions</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Cars Stat */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <CarOutlined className="text-2xl text-primary-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-600">Total Cars</p>
              <p className="text-3xl font-bold text-slate-900">{totalCars}</p>
              <p className="text-xs text-slate-500">{availableCars} available for sale</p>
            </div>
          </div>

          {/* Active Bookings Stat */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CalendarOutlined className="text-2xl text-blue-600" />
              </div>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                Pending
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-600">Active Bookings</p>
              <p className="text-3xl font-bold text-slate-900">{activeBookings}</p>
              <p className="text-xs text-slate-500">Test drive requests</p>
            </div>
          </div>

          {/* Revenue Stat */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarOutlined className="text-2xl text-green-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Revenue
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-600">Total Revenue</p>
              <p className="text-3xl font-bold text-slate-900">${(totalRevenue / 1000).toFixed(0)}K</p>
              <p className="text-xs text-slate-500">From sold vehicles</p>
            </div>
          </div>

          {/* Performance Stat */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <RiseOutlined className="text-2xl text-purple-600" />
              </div>
              <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                Growth
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-600">Conversion Rate</p>
              <p className="text-3xl font-bold text-slate-900">
                {totalCars > 0 ? Math.round((activeBookings / totalCars) * 100) : 0}%
              </p>
              <p className="text-xs text-slate-500">Booking to inventory ratio</p>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab} 
            items={tabItems}
            className="admin-tabs"
          />
        </div>
      </div>

      <AddEditCarDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        car={selectedCar}
        onSuccess={fetchCars}
      />

      <ManageCarImagesModal
        open={imagesModalOpen}
        onClose={() => setImagesModalOpen(false)}
        car={selectedCar}
        onSuccess={fetchCars}
      />

      <Modal
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <CloseOutlined className="text-red-600" />
            </div>
            <span className="font-semibold">Reject Test Drive Request</span>
          </div>
        }
        open={rejectModalOpen}
        onOk={handleRejectTestDrive}
        onCancel={() => {
          setRejectModalOpen(false)
          setRejectReason('')
          setSelectedTestDrive(null)
        }}
        okText="Confirm Rejection"
        okButtonProps={{ danger: true }}
        cancelButtonProps={{ className: 'hover:bg-slate-100' }}
      >
        <div className="space-y-4 mt-4">
          <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <ThunderboltOutlined className="mr-2" />
              An automated rejection email will be sent to the customer immediately.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Reason for rejection (internal use only)
            </label>
            <Input.TextArea
              rows={4}
              placeholder="Enter reason for internal records..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="resize-none"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}