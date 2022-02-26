import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../../App'

function RequireAuth({ children, allowedRoles }) {
    const { state: auth } = React.useContext(AuthContext)
    const location = useLocation()

    if (!auth.isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} />
    } else {
        return children
    }
}

export default RequireAuth
