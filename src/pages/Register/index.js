import React from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { LOGIN } from '../../action-types'
import { AuthContext } from '../../App'
import { apiUrl } from '../../utils/api-url'

function Register() {
    const { dispatch, state: authState } = React.useContext(AuthContext)
    const navigate = useNavigate()

    const initialState = {
        name: '',
        password: '',
        isSubmitting: false,
        errorMessage: null
    }

    const [data, setData] = React.useState(initialState)

    const handleInputChange = event => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        })
    }

    const handleFormSubmit = () => {
        setData({
            ...data,
            isSubmitting: true,
            errorMessage: null
        })

        fetch(apiUrl('register'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: data.name,
                password: data.password
            })
        }).then(response => {
            if (response.ok) {
                return response.json()
            } else {
                throw response
            }
        }).then(data => {
            dispatch({
                type: LOGIN,
                payload: data
            })

            navigate('/home')
        }).catch(error => {
            console.error(error)

            setData({
                ...data,
                isSubmitting: false,
                errorMessage: 'Credenciales invalidas'
            })
        })
    }
    if (authState.isAuthenticated) return <Navigate to='/home'  />
    return (
        <div className="login-container">
            <div className="card">
                <div className="container">
                    <h1>Registro de cuenta nueva</h1>

                    <label htmlFor="name">
                        Nombre
                        <input
                            type="text"
                            value={data.name}
                            onChange={handleInputChange}
                            name="name"
                            id="name"
                        />
                    </label>

                    <label htmlFor="password">
                        Contraseña
                        <input
                            type="password"
                            value={data.password}
                            onChange={handleInputChange}
                            name="password"
                            id="password"
                        />
                    </label>

                    <button onClick={handleFormSubmit} disabled={data.isSubmitting}>
                        {data.isSubmitting ? (
                            "Espere..."
                        ) : (
                            "Ingresar"
                        )}
                    </button>

                    {data.errorMessage && (
                        <span className="form-error">{data.errorMessage}</span>
                    )}

                    <br/>
                    <Link to="/login">Iniciar sesion</Link>
                    <br/>
                    <Link to="/">Volver a landing</Link>
                </div>
            </div>
        </div>
    )
}

export default Register
