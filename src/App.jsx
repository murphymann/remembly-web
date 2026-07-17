import { useState } from 'react'
import './App.css'

function App() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin(e){
    e.preventDefault()
    
    try {
      const response = await fetch('https://remembly-production.up.railway.app/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      console.log('Login response:', data)
    } catch (err){
      console.error('Login failed:', err)
    }
  }

  return (
    <div>
      <h1>Remembly</h1>
      <form onSubmit={handleLogin}>
        <input 
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        />
        <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        />
        <button type="submit">Log in</button>
      </form>
    </div>
  )
}

export default App