import './App.scss'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import React, { createContext, useReducer, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import RequireAuth from './components/RequireAuth'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import NewGame from './pages/NewGame'
import ResumeGame from './pages/ResumeGame'
import GameStats from './pages/GameStats'
import Game from './pages/Game'
import { LOGIN, LOGOUT, CREATE_GAME_FAILURE, CREATE_GAME_SUCCESS, CREATE_GAME_REQUEST } from './action-types'

export const AuthContext = createContext()
export const GameContext = createContext()

const initialState = {
    isAuthenticated: !!localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user')),
    token: localStorage.getItem('token'),
}

const initialGameState = {
    opponent: '',
    game: {},
    isSending: false,
    hasError: false
}

const gameReducer = (state, action) => {
    switch (action.type) {
        case CREATE_GAME_REQUEST:
            return {
                ...state,
               // opponent: action.payload.opponent,
                isSending: true,
                hasError: false
            }
        case CREATE_GAME_SUCCESS:
            return {
                ...state,
                isSending: false,
                // users: action.payload.users
            }
        case CREATE_GAME_FAILURE:
            return {
                ...state,
                hasError: true,
                isSending: false
            }
        default:
            return state
    }
}

const reducer = (state, action) => {
    switch (action.type) {
        case LOGIN:
            localStorage.setItem('user', JSON.stringify(action.payload.user))
            localStorage.setItem('token', action.payload.user.token)

            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.user.token,
            }
        case LOGOUT:
            localStorage.clear()

            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
            }
        default:
            return state
    }
}

function App() {
    const location = useLocation()
    const [state, dispatch] = useReducer(reducer, initialState)
    const [gameState, gameDispatch] = useReducer(gameReducer, initialGameState)


    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            <GameContext.Provider value={{ gameState, gameDispatch }}>
            <div className="App">
                <Routes>
                    <Route path="/home" element={
                        <RequireAuth>
                            <Home />
                        </RequireAuth>
                    } />
                    <Route path="/newgame" element={
                        <RequireAuth>
                            <NewGame />
                        </RequireAuth>
                    } />
                    <Route path="/game" element={
                        <RequireAuth>
                            <Game />
                        </RequireAuth>
                    } />
                    <Route path="/resumegame" element={
                        <RequireAuth>
                            <ResumeGame />
                        </RequireAuth>
                    } />
                    <Route path="/stats" element={
                        <RequireAuth>
                            <GameStats />
                        </RequireAuth>
                    } />

                    <Route path="/login" element={
                        <Login />
                    } />

                    <Route path="/register" element={
                        <Register />
                    } />

                    <Route path="/" element={
                        <Landing />
                    } />

                    <Route path="*" element={
                        <NotFound />
                    } />
                </Routes>

            </div>
            </GameContext.Provider>
        </AuthContext.Provider>
    )
}


export default App;