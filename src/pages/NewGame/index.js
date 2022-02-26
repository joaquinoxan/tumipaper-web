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
import { GameContext } from '../../App'
import { apiUrl } from '../../utils/api-url'
import { FETCH_USERS_FAILURE, FETCH_USERS_SUCCESS, FETCH_USERS_REQUEST } from './action-types'
import { CREATE_GAME_FAILURE, CREATE_GAME_SUCCESS, CREATE_GAME_REQUEST } from '../../action-types'


const initialState = {
    users: [],
    isFetching: false,
    hasError: false
}



const reducer = (state, action) => {
    switch (action.type) {
        case FETCH_USERS_REQUEST:
            return {
                ...state,
                isFetching: true,
                hasError: false
            }
        case FETCH_USERS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                users: action.payload.users
            }
        case FETCH_USERS_FAILURE:
            return {
                ...state,
                hasError: true,
                isFetching: false
            }
        default:
            return state
    }
}



export default function NewGame() {
    const navigate = useNavigate()
    const { state: authState } = useContext(AuthContext)
    const [state, dispatch] = useReducer(reducer, initialState)
    const { gameState, gameDispatch } = React.useContext(GameContext)



    const [gameData, setGameData] = React.useState(gameState)

    const createGame = (opponent_name) => {

        gameDispatch({ type: CREATE_GAME_REQUEST })
        fetch(apiUrl(`game/${opponent_name}`), {
            method: 'POST',
            headers: {
                'Authorization': authState.token
            }
        }).then(response => {
            setGameData(
                {
                    ...gameData,
                    opponent: opponent_name
                }
            )
            if (response.ok) {
                return response
            } else {
                throw response
            }
        }).then(data => {
            gameDispatch({
                type: CREATE_GAME_SUCCESS
            })

        }).catch(error => {
            console.error(error)
            gameDispatch({
                type: CREATE_GAME_FAILURE
            })
        }).finally(() => {
            console.log(gameData)
            navigate('/game')
        })
    }


    useEffect(() => {
        if (authState.token) {
            dispatch({
                type: FETCH_USERS_REQUEST
            })

            fetch(apiUrl('users'), {
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
                    type: FETCH_USERS_SUCCESS,
                    payload: data
                })
            }).catch(error => {
                console.error('Error en fetch de todos', error)

                if (error.status === 403) {
                    navigate('fail')
                } else {
                    dispatch({
                        type: FETCH_USERS_FAILURE
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
                    Select Opponent
                </Typography>
                <List sx={{ width: '100%', maxWidth: 360, maxHeight: 300, overflow: 'auto', bgcolor: 'background.paper' }}>
                    {state.users.map((user) => {

                        return (
                            <ListItem
                                key={user.name}
                                secondaryAction={
                                    <Button variant="contained" size="small" onClick={() => {createGame(user.name)}}>Start</Button>
                                }
                                disablePadding
                            >
                                <ListItemButton role={undefined} dense>
                                    <ListItemText id={user.name} primary={user.name} />
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