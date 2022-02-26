import React, { useContext, useEffect, useReducer } from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles'
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../App'
import { apiUrl } from '../../utils/api-url'
import { FETCH_GAMES_FAILURE, FETCH_GAMES_SUCCESS, FETCH_GAMES_REQUEST } from './action-types'


const initialState = {
    games: [],
    played: 0,
    won: 0,
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
                games: action.payload.games,
                played: action.payload.meta.games_played,
                won: action.payload.meta.games_won
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



const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const columns = [
    { id: 'name', label: 'Opponent', minWidth: 170 },
    { id: 'code', label: 'Game Winner', minWidth: 170 },
];

function createData(name, code) {
    return { name, code };
}

var rows = []

export default function GameStats() {

    const navigate = useNavigate()
    const { state: authState } = useContext(AuthContext)
    const [state, dispatch] = useReducer(reducer, initialState)


    useEffect(() => {
        if (authState.token) {
            dispatch({
                type: FETCH_GAMES_REQUEST
            })

            fetch(apiUrl('user/games'), {
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
    
    state.games.forEach(game => {
        rows.push(createData(game.player1 == authState.user.name ? game.player2 : game.player1, game.winner == '' ? 'DRAW' : game.winner))
    });
    rows.splice(0, Math.trunc(rows.length / 2))
    return (
        <Container maxWidth="xs">
            <Stack spacing={2} alignItems="center" direction="column">
                <Typography variant="h2" gutterBottom component="div" align="center">
                    Game Stats
                </Typography>
                <Grid container style={{ textAlign: "center" }} spacing={4}>
                    <Grid item xs={6}>
                        <Item>
                            <Typography variant="h4" gutterBottom component="div" align="center">
                                Played: {state.played}
                            </Typography>
                        </Item>
                    </Grid>
                    <Grid item xs={6}>
                        <Item>
                            <Typography variant="h4" gutterBottom component="div" align="center">
                                Won: {state.won}
                            </Typography>
                        </Item>
                    </Grid>
                    <Grid item xs={12}>
                        <Item>

                            <TableContainer sx={{ maxHeight: 400 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((column) => (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                    style={{ minWidth: column.minWidth }}
                                                >
                                                    {column.label}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows

                                            .map((row) => {
                                                return (
                                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                                        {columns.map((column) => {
                                                            const value = row[column.id];
                                                            return (
                                                                <TableCell key={column.id} align={column.align}>
                                                                    {column.format && typeof value === 'number'
                                                                        ? column.format(value)
                                                                        : value}
                                                                </TableCell>
                                                            );
                                                        })}
                                                    </TableRow>
                                                );
                                            })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Item>
                    </Grid>
                </Grid>
                <Button variant="outlined" fullWidth href="home">Return to Home</Button>
                <br />
                <br />
            </Stack>
        </Container>

    );
}