import { Modal, Image, Button, Space, Tag, Upload, message, Row, Col, Typography, Divider } from 'antd'
import { StarOutlined, StarFilled, DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { adminCarsApi } from '../api/adminCarsApi'
import { getImageUrl } from '../utils/imageUtils'

const { Title, Text } = Typography

/**
 * ManageCarImagesModal handles viewing, deleting, and uploading images for a specific car.
 * It also allows the Admin to designate a "Primary" image for the car listing.
 */
export default function ManageCarImagesModal({ open, onClose, car, onSuccess }) {
  const [uploading, setUploading] = useState(false)
  const [fileList, setFileList] = useState([])

  if (!car) return null

  // 1. Set an image as the primary thumbnail for the car
  const handleSetPrimary = async (imageId) => {
    try {
      await adminCarsApi.setPrimaryImage(car.id, imageId)
      message.success('Primary image updated successfully')
      onSuccess() // Refresh the car data in the dashboard
    } catch (err) {
      console.error(err)
      message.error('Failed to update primary image')
    }
  }

  // 2. Permanently delete an image from the server
  const handleDeleteImage = async (imageId) => {
    try {
      await adminCarsApi.deleteImage(car.id, imageId)
      message.success('Image removed')
      onSuccess()
    } catch (err) {
      console.error(err)
      message.error('Failed to delete image')
    }
  }

  // 3. Handle the batch upload of new images
  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning('Please select at least one image to upload')
      return
    }

    setUploading(true)
    const formData = new FormData()
    fileList.forEach((file) => {
      // 'images' must match the @RequestParam("images") in your Spring Boot controller
      formData.append('images', file.originFileObj)
    })

    try {
      await adminCarsApi.addImages(car.id, formData)
      message.success(`${fileList.length} images uploaded successfully`)
      setFileList([]) // Clear the upload queue
      onSuccess()
    } catch (error) {
      console.error('Upload error:', error)
      message.error('Failed to upload images. Check file size or server connection.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Modal
      title={
        <Space>
          <UploadOutlined />
          <span>{`Manage Media: ${car.make} ${car.model} (${car.year})`}</span>
        </Space>
      }
      open={open}
      onCancel={onClose}
      width={900}
      footer={null}
      destroyOnHidden
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        
        {/* SECTION: EXISTING IMAGES */}
        <section>
          <Title level={5}>Current Gallery</Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
            The primary image is shown as the main thumbnail in the store.
          </Text>
          <Row gutter={[16, 16]}>
            {car.images && car.images.length > 0 ? (
              car.images.map((img) => (
                <Col span={8} key={img.id}>
                  <div style={{ position: 'relative', border: '1px solid #f0f0f0', borderRadius: 8, overflow: 'hidden' }}>
                    <Image
                      src={getImageUrl(img.imagePath)}
                      alt="Car"
                      width="100%"
                      fallback="https://placehold.co/600x400?text=Image+Not+Found"
                    />
                    
                    {img.primaryImage && (
                      <Tag
                        color="gold"
                        style={{ position: 'absolute', top: 8, left: 8, margin: 0 }}
                        icon={<StarFilled />}
                      >
                        Primary
                      </Tag>
                    )}

                    <div style={{ 
                      padding: '8px', 
                      background: '#fff', 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      {!img.primaryImage ? (
                        <Button
                          type="link"
                          size="small"
                          icon={<StarOutlined />}
                          onClick={() => handleSetPrimary(img.id)}
                        >
                          Set Primary
                        </Button>
                      ) : <span style={{ width: 1 }}></span>}
                      
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteImage(img.id)}
                      />
                    </div>
                  </div>
                </Col>
              ))
            ) : (
              <Col span={24}>
                <div style={{ padding: '40px', background: '#fafafa', textAlign: 'center', borderRadius: 8 }}>
                  <Text type="secondary">This vehicle has no images yet.</Text>
                </div>
              </Col>
            )}
          </Row>
        </section>

        <Divider />

        {/* SECTION: UPLOAD NEW IMAGES */}
        <section>
          <Title level={5}>Add New Photos</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Upload
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false} // Prevent automatic upload
              accept="image/*"
              multiple
              listType="picture-card"
            >
              {fileList.length < 10 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Add to Queue</div>
                </div>
              )}
            </Upload>
            
            <Button
              type="primary"
              size="large"
              icon={<UploadOutlined />}
              onClick={handleUpload}
              loading={uploading}
              disabled={fileList.length === 0}
              style={{ marginTop: 16 }}
            >
              {uploading ? 'Uploading...' : 'Confirm Upload'}
            </Button>
          </Space>
        </section>
      </Space>
    </Modal>
  )
}