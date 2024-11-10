import { useLocation } from 'react-router-dom'

export const usePageBack = () => {
  const location = useLocation()

  const searchParams = new URLSearchParams(location.search)
  const pageBack = searchParams.get('pageBack')
  if (pageBack) {
    try {
      return JSON.parse(decodeURIComponent(pageBack))
    } catch (error) {
      console.error('Failed to parse pageBack:', error)
    }
  }

  return null
}
