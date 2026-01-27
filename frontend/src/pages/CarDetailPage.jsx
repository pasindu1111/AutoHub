import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Row,
  Col,
  Typography,
  Button,
  Space,
  Tag,
  Divider,
  Spin,
  message,
  Descriptions
} from 'antd'
import { HeartOutlined, HeartFilled, CalendarOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import CarImageGallery from '../components/CarImageGallery'
import BookTestDriveModal from '../components/BookTestDriveModal'
import { carsApi } from '../api/carsApi'
import { favoritesApi } from '../api/favoritesApi'
import useAuthStore from '../store/authStore'

const { Title, Text, Paragraph } = Typography

export default function CarDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [bookingModalOpen, setBookingModalOpen] = useState(false)

  useEffect(() => {
    fetchCarDetails()
    if (isAuthenticated) {
      checkIfFavorite()
    }
  }, [id, isAuthenticated])

  const fetchCarDetails = async () => {
    setLoading(true)
    try {
      const response = await carsApi.getCarById(id)
      if (response.success && response.data) {
        setCar(response.data)
      }
    } catch (error) {
      message.error('Failed to load car details')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const checkIfFavorite = async () => {
    try {
      const response = await favoritesApi.getMyFavorites()
      if (response.success && response.data) {
        const isFav = response.data.some(fav => fav.carId === parseInt(id))
        setIsFavorite(isFav)
      }
    } catch (error) {
      console.error('Failed to check favorite status:', error)
    }
  }

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      message.warning('Please login to manage favorites')
      navigate('/login')
      return
    }

    try {
      if (isFavorite) {
        await favoritesApi.removeFavorite(car.id)
        message.success('Removed from favorites')
        setIsFavorite(false)
      } else {
        await favoritesApi.addFavorite(car.id)
        message.success('Added to favorites')
        setIsFavorite(true)
      }
    } catch (error) {
      message.error('Failed to update favorites')
    }
  }

  const handleBookTestDrive = () => {
    if (!isAuthenticated) {
      message.warning('Please login to book a test drive')
      navigate('/login')
      return
    }
    setBookingModalOpen(true)
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!car) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0' }}>
        <Text>Car not found</Text>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/cars')}
        style={{ marginBottom: 24 }}
      >
        Back to Inventory
      </Button>

      <Row gutter={[32, 32]}>
        {/* Image Gallery */}
        <Col xs={24} lg={14}>
          <CarImageGallery images={car.images} primaryImage={car.primaryImage} />
        </Col>

        {/* Car Info */}
        <Col xs={24} lg={10}>
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            <div>
              <Space size={12} style={{ marginBottom: 12 }}>
                <Tag color="blue">{car.year}</Tag>
                <Tag>{car.transmission}</Tag>
                <Tag color="green">{car.fuelType}</Tag>
                {car.status && (
                  <Tag color={car.status === 'AVAILABLE' ? 'success' : 'default'}>
                    {car.status}
                  </Tag>
                )}
              </Space>

              <Title level={2} style={{ marginBottom: 8 }}>
                {car.make} {car.model}
              </Title>

              <Title level={3} style={{ color: '#1f5aa6', marginTop: 16 }}>
                ${car.price.toLocaleString()}
              </Title>
            </div>

            <Divider />

            <Descriptions column={1} size="small">
              <Descriptions.Item label="Make">{car.make}</Descriptions.Item>
              <Descriptions.Item label="Model">{car.model}</Descriptions.Item>
              <Descriptions.Item label="Year">{car.year}</Descriptions.Item>
              <Descriptions.Item label="Transmission">{car.transmission}</Descriptions.Item>
              <Descriptions.Item label="Fuel Type">{car.fuelType}</Descriptions.Item>
              <Descriptions.Item label="Status">{car.status}</Descriptions.Item>
            </Descriptions>

            {car.description && (
              <>
                <Divider />
                <div>
                  <Text strong style={{ fontSize: 16 }}>
                    Description
                  </Text>
                  <Paragraph style={{ marginTop: 12, lineHeight: 1.8 }}>{car.description}</Paragraph>
                </div>
              </>
            )}

            <Divider />

            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <Button
                type="primary"
                size="large"
                icon={<CalendarOutlined />}
                onClick={handleBookTestDrive}
                block
                disabled={car.status !== 'AVAILABLE'}
              >
                Book Test Drive
              </Button>

              <Button
                size="large"
                icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
                onClick={handleFavoriteToggle}
                block
              >
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
            </Space>
          </Space>
        </Col>
      </Row>

      <BookTestDriveModal
        open={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        carId={car.id}
        carName={`${car.make} ${car.model}`}
      />
    </motion.div>
  )
}
