import { Component } from 'react'
import { Result, Button } from 'antd'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error boundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '64px 24px', textAlign: 'center' }}>
          <Result
            status="error"
            title="Something went wrong"
            subTitle="Sorry, an unexpected error occurred. Please try refreshing the page."
            extra={[
              <Button type="primary" key="home" onClick={() => (window.location.href = '/')}>
                Go Home
              </Button>,
              <Button key="reload" onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            ]}
          />
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
