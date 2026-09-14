import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import PlayerSearch from './pages/PlayerSearch'
import Teams from './pages/Teams'
import CreateTeam from './pages/CreateTeam'
import TeamProfile from './pages/TeamProfile'
import Recruitment from './pages/Recruitment'
import BuildTeam from './pages/BuildTeam'
import Feed from './pages/Feed'
import Messages from './pages/Messages'
import './index.css'

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'placeholder'}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/home" element={<Feed />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/players" element={<PlayerSearch />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/create-team" element={<CreateTeam />} />
              <Route path="/teams/:id" element={<TeamProfile />} />
              <Route path="/recruitment" element={<Recruitment />} />
              <Route path="/build-team" element={<BuildTeam />} />
              <Route path="/messages" element={<Messages />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

export default App
