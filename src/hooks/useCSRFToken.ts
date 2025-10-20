import { useState, useEffect } from 'react'

export function useCSRFToken() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchCSRFToken = async () => {
      try {
        const response = await fetch('/api/csrf')
        const data = await response.json()
        
        if (isMounted) {
          setCsrfToken(data.token)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error)
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchCSRFToken()

    return () => {
      isMounted = false
    }
  }, [])

  const refreshToken = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/csrf')
      const data = await response.json()
      setCsrfToken(data.token)
      setIsLoading(false)
      return data.token
    } catch (error) {
      console.error('Failed to refresh CSRF token:', error)
      setIsLoading(false)
      return null
    }
  }

  return { csrfToken, isLoading, refreshToken }
}