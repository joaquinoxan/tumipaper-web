import React from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { AuthContext } from '../../App'
import { LOGOUT } from '../../action-types'
import { useNavigate } from 'react-router-dom'


function Home() {
    const { dispatch, state: authState } = React.useContext(AuthContext)
    const navigate = useNavigate()

    const logout = () => {
        dispatch({ type: LOGOUT })
        navigate('/')
    }
    return (
        <Container maxWidth="xs">
            <Stack spacing={2} direction="column">
                <Typography variant="h2" gutterBottom component="div" align="center">
                    Home
                </Typography>
                <Typography variant="h5" gutterBottom component="div" align="center">
                    Player: {authState.user.name}
                </Typography>
                <Button variant="contained" href="newgame">Crate New Game</Button>
                <Button variant="contained" href="resumegame">Games in Progress</Button>
                <Button variant="contained" href="stats">Game Stats</Button>
                <Button variant="outlined" onClick={logout}>Log out</Button>
            </Stack>
        </Container>

    )
}

export default Home