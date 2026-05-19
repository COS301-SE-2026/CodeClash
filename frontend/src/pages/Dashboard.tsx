import React from 'react'
import { useAuth } from '../context/AuthContext'

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth()

  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '1rem' }}>
      <h1>Welcome, {user?.username ?? 'Player'}</h1>
      <p>You are signed in.</p>
      <button className="signin-button" type="button" onClick={signOut}>
        Sign out
      </button>
    </div>
  )
}

export default Dashboard
