import React from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { AuthContext } from '../../App'
import { GameContext } from '../../App'
import IconButton from '@mui/material/IconButton';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import { useNavigate } from 'react-router-dom'
import FeedIcon from '@mui/icons-material/Feed';
import CircleIcon from '@mui/icons-material/Circle';


function Game() {
    const { dispatch, state: authState } = React.useContext(AuthContext)
    const { gameState } = React.useContext(GameContext)
    const navigate = useNavigate()
    console.log(gameState)

    return (
        <Container maxWidth="xs">
            <Stack spacing={5} direction="column">
                <Typography variant="h6" gutterBottom component="div" align="right">
                    Opponent: {gameState.opponent}
                </Typography>
                <Typography variant="h3" gutterBottom component="div" align="center">
                    Round 1
                </Typography>
                <Typography variant="h4" gutterBottom component="div" align="center">
                    Select your Hand...
                </Typography>
                <Stack direction="row" justifyContent="center" spacing={2}>
                    <IconButton aria-label="delete" size="large">
                        <ContentCutIcon  sx={{ fontSize: 60 }} />
                    </IconButton>
                    <IconButton aria-label="delete" size="large">
                        <FeedIcon sx={{ fontSize: 60 }} />
                    </IconButton>
                    <IconButton aria-label="delete" size="large">
                        <CircleIcon sx={{ fontSize: 60 }} />
                    </IconButton>
                </Stack>

                <Button variant="outlined" href="home">Return to Home</Button>
            </Stack>
        </Container>

    )
}

export default Game