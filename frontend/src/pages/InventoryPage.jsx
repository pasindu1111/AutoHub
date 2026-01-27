import { useState, useEffect } from 'react'
import { Row, Col, Typography, Spin, Empty, message, Pagination } from 'antd'
import CarCard from '../components/CarCard'
import CarFilterSidebar from '../components/CarFilterSidebar'
import { carsApi } from '../api/carsApi'
import apiClient from '../api/axiosConfig'
import useAuthStore from '../store/authStore'

const { Title } = Typography

export default function InventoryPage() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({})
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0
  })
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    fetchCars(filters, pagination.current, pagination.pageSize)
  }, [filters, pagination.current, pagination.pageSize])

  const fetchCars = async (currentFilters, page = 1, size = 12) => {
    setLoading(true)
    try {
      const response = await carsApi.getPublicCars(currentFilters, {
        page: page - 1, // Backend uses 0-based indexing
        size: size
      })
      if (response.success && response.data) {
        setCars(response.data.content)
        setPagination(prev => ({
          ...prev,
          total: response.data.totalElements
        }))
      }
    } catch (error) {
      console.error('Failed to fetch cars:', error)
      message.error('Failed to load cars')
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = (newFilters) => {
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, current: 1 })) // Reset to first page on filter change
  }

  const handleReset = () => {
    setFilters({})
    setPagination(prev => ({ ...prev, current: 1 }))
  }

  const handlePageChange = (page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize
    }))
  }

  const handleFavorite = async (carId) => {
    if (!isAuthenticated) {
      message.warning('Please login to save favorites')
      return
    }

    try {
      await apiClient.post(`/favorites/${carId}`)
      message.success('Added to favorites')
    } catch (error) {
      message.error('Failed to add favorite')
    }
  }

  return (
    <div>
      <Title level={2} style={{ marginBottom: 32 }}>
        Browse Our Inventory
      </Title>

      <Row gutter={[24, 24]}>
        {/* Filter Sidebar */}
        <Col xs={24} lg={6}>
          <CarFilterSidebar onFilter={handleFilter} onReset={handleReset} />
        </Col>

        {/* Car Grid */}
        <Col xs={24} lg={18}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '64px 0' }}>
              <Spin size="large" />
            </div>
          ) : cars.length > 0 ? (
            <>
              <Row gutter={[24, 24]}>
                {cars.map((car) => (
                  <Col xs={24} sm={12} xl={8} key={car.id}>
                    <CarCard car={car} onFavorite={isAuthenticated ? handleFavorite : null} />
                  </Col>
                ))}
              </Row>
              <div style={{ textAlign: 'center', marginTop: 48 }}>
                <Pagination
                  current={pagination.current}
                  pageSize={pagination.pageSize}
                  total={pagination.total}
                  onChange={handlePageChange}
                  showSizeChanger
                  showTotal={(total) => `Total ${total} cars`}
                  pageSizeOptions={['12', '24', '36', '48']}
                />
              </div>
            </>
          ) : (
            <Empty
              description="No cars found matching your criteria"
              style={{ marginTop: 64 }}
            />
          )}
        </Col>
      </Row>
    </div>
  )
}
