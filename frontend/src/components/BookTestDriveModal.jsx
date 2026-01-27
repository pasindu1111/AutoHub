import { Modal, Form, DatePicker, message } from 'antd'
import { testDriveApi } from '../api/testDriveApi'
import dayjs from 'dayjs'

export default function BookTestDriveModal({ open, onClose, carId, carName }) {
  const [form] = Form.useForm()

  const handleSubmit = async (values) => {
    try {
      const appointmentDate = values.appointmentDate.format('YYYY-MM-DDTHH:mm:ss')
      const response = await testDriveApi.bookTestDrive(carId, appointmentDate)

      if (response.success) {
        message.success('Test drive booking request submitted!')
        form.resetFields()
        onClose()
      } else {
        message.error(response.message || 'Booking failed')
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to book test drive. Please try another time slot.'
      message.error(errorMsg)
    }
  }

  const disabledDate = (current) => {
    // Disable past dates
    return current && current < dayjs().startOf('day')
  }

  const disabledTime = (current) => {
    // Disable past hours for today
    if (current && current.isSame(dayjs(), 'day')) {
      return {
        disabledHours: () => Array.from({ length: dayjs().hour() }, (_, i) => i)
      }
    }
    return {}
  }

  return (
    <Modal
      title={`Book Test Drive - ${carName}`}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Book Now"
      width={480}
      destroyOnHidden
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="appointmentDate"
          label="Select Date & Time"
          rules={[{ required: true, message: 'Please select a date and time' }]}
        >
          <DatePicker
            showTime={{ format: 'HH:mm', minuteStep: 30 }}
            format="YYYY-MM-DD HH:mm"
            disabledDate={disabledDate}
            disabledTime={disabledTime}
            style={{ width: '100%' }}
            placeholder="Choose appointment slot"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
