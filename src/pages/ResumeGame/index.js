import React, { useContext, useEffect, useReducer } from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../App'
import { apiUrl } from '../../utils/api-url'
import { FETCH_GAMES_FAILURE, FETCH_GAMES_SUCCESS, FETCH_GAMES_REQUEST } from './action-types'

const initialState = {
    games: [],
    isFetching: false,
    hasError: false
}

const reducer = (state, action) => {
    switch (action.type) {
        case FETCH_GAMES_REQUEST:
            return {
                ...state,
                isFetching: true,
                hasError: false
            }
        case FETCH_GAMES_SUCCESS:
            return {
                ...state,
                isFetching: false,
                games: action.payload.games
            }
        case FETCH_GAMES_FAILURE:
            return {
                ...state,
                hasError: true,
                isFetching: false
            }
        default:
            return state
    }
}


export default function ResumeGame() {
    const navigate = useNavigate()
    const { state: authState } = useContext(AuthContext)
    const [state, dispatch] = useReducer(reducer, initialState)


    useEffect(() => {
        if (authState.token) {
            dispatch({
                type: FETCH_GAMES_REQUEST
            })

            fetch(apiUrl('user/games/inprogress'), {
                headers: {
                    'Authorization': authState.token,
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw response
                }
            }).then(data => {
                dispatch({
                    type: FETCH_GAMES_SUCCESS,
                    payload: data
                })
            }).catch(error => {
                console.error('Error en fetch de todos', error)

                if (error.status === 403) {
                    navigate('fail')
                } else {
                    dispatch({
                        type: FETCH_GAMES_FAILURE
                    })
                }
            }).finally(() => {
            })
        }
    }, [authState.token, navigate])

    return (
        <Container maxWidth="xs">
            <Stack spacing={2} direction="column">
                <Typography variant="h2" gutterBottom component="div" align="center">
                    Select Game
                </Typography>
                <List sx={{ width: '100%', maxWidth: 360, maxHeight: 300, overflow: 'auto', bgcolor: 'background.paper' }}>
                    {state.games.map((game) => {

                        return (
                            <ListItem
                                key={game.player1 == authState.user.name ? game.player2 : game.player1}
                                secondaryAction={
                                    <Button variant="contained" size="small">Resume</Button>
                                }
                                disablePadding
                            >
                                <ListItemButton role={undefined} dense>
                                    <ListItemText id={game.player1 == authState.user.name ? game.player2 : game.player1} primary={game.player1 == authState.user.name ? game.player2 : game.player1} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
                <Button variant="outlined" href="home">Return to Home</Button>
            </Stack>
        </Container>

    );
}