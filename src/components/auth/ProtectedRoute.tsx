import { Navigate, useLocation } from 'react-router-dom'
import useMainStore from '@/stores/main'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useMainStore()
  const location = useLocation()

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
