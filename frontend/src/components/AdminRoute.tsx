import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const AdminRoute = () => {
    const { loading, isAuthenticated, isAdmin } = useAuth()

    if (loading) {
        return null
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }
    if (!isAdmin) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

export default AdminRoute
