import { Drawer, Form, Input, InputNumber, Select, Upload, Button, message, Space } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { adminCarsApi } from '../api/adminCarsApi'

const { Option } = Select
const { TextArea } = Input

export default function AddEditCarDrawer({ open, onClose, car, onSuccess }) {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState([])
  const [loading, setLoading] = useState(false)

  const isEdit = !!car

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      if (isEdit) {
        // Update existing car
        const response = await adminCarsApi.updateCar(car.id, values)
        if (response.success) {
          message.success('Car updated successfully')
          onSuccess()
          onClose()
        }
      } else {
        // Create new car with images
        const formData = new FormData()
        const carData = {
          make: values.make,
          model: values.model,
          year: values.year,
          price: values.price,
          transmission: values.transmission,
          fuelType: values.fuelType,
          description: values.description || ''
        }
        formData.append('data', new Blob([JSON.stringify(carData)], { type: 'application/json' }))

        fileList.forEach((file) => {
          formData.append('images', file.originFileObj)
        })

        const response = await adminCarsApi.createCar(formData)
        if (response.success) {
          message.success('Car created successfully')
          onSuccess()
          onClose()
          form.resetFields()
          setFileList([])
        }
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Operation failed')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    form.resetFields()
    setFileList([])
    onClose()
  }

  return (
    <Drawer
      title={isEdit ? 'Edit Car' : 'Add New Car'}
      size={520}
      open={open}
      onClose={handleClose}
      destroyOnHidden
      footer={
        <Space style={{ float: 'right' }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="primary" onClick={() => form.submit()} loading={loading}>
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={car || {}}
      >
        <Form.Item name="make" label="Make" rules={[{ required: true }]}>
          <Input placeholder="Toyota" />
        </Form.Item>

        <Form.Item name="model" label="Model" rules={[{ required: true }]}>
          <Input placeholder="Camry" />
        </Form.Item>

        <Form.Item name="year" label="Year" rules={[{ required: true }]}>
          <InputNumber min={1886} placeholder="2022" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="price" label="Price ($)" rules={[{ required: true }]}>
          <InputNumber min={0} placeholder="25000" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="transmission" label="Transmission" rules={[{ required: true }]}>
          <Select placeholder="Select transmission">
            <Option value="MANUAL">Manual</Option>
            <Option value="AUTOMATIC">Automatic</Option>
          </Select>
        </Form.Item>

        <Form.Item name="fuelType" label="Fuel Type" rules={[{ required: true }]}>
          <Select placeholder="Select fuel type">
            <Option value="GASOLINE">Gasoline</Option>
            <Option value="DIESEL">Diesel</Option>
            <Option value="HYBRID">Hybrid</Option>
            <Option value="ELECTRIC">Electric</Option>
          </Select>
        </Form.Item>

        <Form.Item name="description" label="Description">
          <TextArea rows={4} placeholder="Car description..." />
        </Form.Item>

        {!isEdit && (
          <Form.Item label="Images">
            <Upload
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              accept="image/*"
              multiple
              listType="picture-card"
              onPreview={(file) => {
                const url = file.url || URL.createObjectURL(file.originFileObj)
                window.open(url, '_blank')
              }}
            >
              {fileList.length < 8 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        )}
      </Form>
    </Drawer>
  )
}
