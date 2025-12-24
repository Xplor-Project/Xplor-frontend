import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const access = urlParams.get('access')
    const refresh = urlParams.get('refresh')

    if (access && refresh) {
      localStorage.setItem('access', access)
      localStorage.setItem('refresh', refresh)
      navigate('/profile')
    } else {
      navigate('/login')
    }
  }, [navigate])

  return <p className="text-center mt-32 text-white">🔄 Redirecting...</p>
}
