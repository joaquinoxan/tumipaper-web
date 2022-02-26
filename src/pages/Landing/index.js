import React from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../../App'

function Landing() {
    const { state: authState } = React.useContext(AuthContext)
    if (authState.isAuthenticated) return <Navigate to='/home' />


    return (
        <Container maxWidth="xs">
            <Stack spacing={2} direction="column">
                <Typography variant="h2" gutterBottom component="div" align="center">
                    TumiPaper
                </Typography>
                <Button variant="contained" href="login">Log In</Button>
                <Button variant="contained" href="register">Register</Button>
            </Stack>
        </Container>

    )
}

export default Landing