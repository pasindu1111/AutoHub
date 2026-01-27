import { useState, useEffect } from 'react'
import { Row, Col, Typography, Spin, Empty, message } from 'antd'
import { motion } from 'framer-motion'
import CarCard from '../components/CarCard'
import { favoritesApi } from '../api/favoritesApi'

const { Title } = Typography

export default function FavoritesPage() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    setLoading(true)
    try {
      const response = await favoritesApi.getMyFavoritesWithDetails()
      if (response.success && response.data) {
        setCars(response.data)
      }
    } catch (error) {
      message.error('Failed to load favorites')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = async (carId) => {
    try {
      await favoritesApi.removeFavorite(carId)
      message.success('Removed from favorites')
      fetchFavorites() // Refresh list
    } catch (error) {
      message.error('Failed to remove favorite')
    }
  }

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
        My Favorites
      </Title>

      {cars.length > 0 ? (
        <Row gutter={[24, 24]}>
          {cars.map((car) => (
            <Col xs={24} sm={12} lg={8} key={car.id}>
              <CarCard car={car} onFavorite={handleRemoveFavorite} />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty
          description="You haven't added any favorites yet"
          style={{ marginTop: 64 }}
        />
      )}
    </motion.div>
  )
}
