import React from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../App'

function NotFound() {
    const { state: authState } = React.useContext(AuthContext)

    return (
        <div>
            <h2>No se encontro el recurso solicitado</h2>

            {authState.isAuthenticated ? (
                <Link to="/home">Volver a home</Link>
            ) : (
                <Link to="/">Volver a landing</Link>
            )}
        </div>
    )
}

export default NotFound
