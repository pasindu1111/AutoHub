import { Card, Form, Input, Select, Slider, Button, Space, Typography } from 'antd'
import { SearchOutlined, ClearOutlined } from '@ant-design/icons'

const { Title } = Typography
const { Option } = Select

export default function CarFilterSidebar({ onFilter, onReset }) {
  const [form] = Form.useForm()

  const handleSubmit = (values) => {
    const filters = {}
    if (values.make) filters.make = values.make
    if (values.model) filters.model = values.model
    if (values.year) filters.year = values.year
    if (values.transmission) filters.transmission = values.transmission
    if (values.fuelType) filters.fuelType = values.fuelType
    if (values.priceRange) {
      filters.minPrice = values.priceRange[0]
      filters.maxPrice = values.priceRange[1]
    }
    onFilter(filters)
  }

  const handleReset = () => {
    form.resetFields()
    onReset()
  }

  return (
    <Card style={{ position: 'sticky', top: 88 }}>
      <Title level={4} style={{ marginBottom: 24 }}>
        Filter Cars
      </Title>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="make" label="Make">
          <Input placeholder="e.g., Toyota" />
        </Form.Item>

        <Form.Item name="model" label="Model">
          <Input placeholder="e.g., Camry" />
        </Form.Item>

        <Form.Item name="year" label="Year">
          <Input type="number" placeholder="e.g., 2022" min={1886} />
        </Form.Item>

        <Form.Item name="transmission" label="Transmission">
          <Select placeholder="Select transmission" allowClear>
            <Option value="MANUAL">Manual</Option>
            <Option value="AUTOMATIC">Automatic</Option>
          </Select>
        </Form.Item>

        <Form.Item name="fuelType" label="Fuel Type">
          <Select placeholder="Select fuel type" allowClear>
            <Option value="GASOLINE">Gasoline</Option>
            <Option value="DIESEL">Diesel</Option>
            <Option value="HYBRID">Hybrid</Option>
            <Option value="ELECTRIC">Electric</Option>
          </Select>
        </Form.Item>

        <Form.Item name="priceRange" label="Price Range ($)">
          <Slider
            range
            min={0}
            max={100000}
            step={1000}
            marks={{
              0: '$0',
              50000: '$50k',
              100000: '$100k'
            }}
            tooltip={{
              formatter: (value) => `$${value.toLocaleString()}`
            }}
          />
        </Form.Item>

        <Space orientation="vertical" size={12} style={{ width: '100%' }}>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />} block>
            Apply Filters
          </Button>
          <Button icon={<ClearOutlined />} onClick={handleReset} block>
            Reset
          </Button>
        </Space>
      </Form>
    </Card>
  )
}
