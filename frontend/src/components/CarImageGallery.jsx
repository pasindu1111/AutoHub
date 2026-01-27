import { useState } from 'react'
import { Image, Row, Col } from 'antd'
import { CarOutlined } from '@ant-design/icons'
import { getImageUrl } from '../utils/imageUtils'

export default function CarImageGallery({ images, primaryImage }) {
  const [selectedImage, setSelectedImage] = useState(primaryImage || images[0]?.imagePath)

  const allImages = images.map((img) => img.imagePath)

  if (!allImages.length) {
    return (
      <div
        style={{
          height: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f0f0f0',
          borderRadius: 12
        }}
      >
        <CarOutlined style={{ fontSize: 72, color: '#bbb' }} />
      </div>
    )
  }

  return (
    <div>
      {/* Main image */}
      <div style={{ marginBottom: 16 }}>
        <Image
          src={getImageUrl(selectedImage)}
          alt="Car main view"
          style={{
            width: '100%',
            height: 400,
            objectFit: 'cover',
            borderRadius: 12
          }}
          preview={{
            src: getImageUrl(selectedImage)
          }}
        />
      </div>

      {/* Thumbnail grid */}
      {allImages.length > 1 && (
        <Row gutter={[12, 12]}>
          {allImages.map((imagePath, index) => (
            <Col span={6} key={index}>
              <div
                onClick={() => setSelectedImage(imagePath)}
                style={{
                  cursor: 'pointer',
                  border: selectedImage === imagePath ? '2px solid #1f5aa6' : '2px solid transparent',
                  borderRadius: 8,
                  overflow: 'hidden',
                  transition: 'all 0.3s'
                }}
              >
                <img
                  src={getImageUrl(imagePath)}
                  alt={`Thumbnail ${index + 1}`}
                  style={{
                    width: '100%',
                    height: 80,
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}
