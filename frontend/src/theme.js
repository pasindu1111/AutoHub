import { theme } from 'antd'

export const appTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#1f5aa6',
    colorInfo: '#1f5aa6',
    colorSuccess: '#22c55e',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorBgBase: '#ffffff',
    colorBorder: '#e5e7eb',
    colorTextBase: '#1f2937',
    fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
    borderRadius: 8,
    wireframe: false
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      bodyBg: '#f8fafc',
      footerBg: '#f8fafc'
    },
    Card: {
      borderRadiusLG: 12,
      boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)'
    },
    Button: {
      controlHeight: 40,
      fontWeight: 600
    }
  }
}
