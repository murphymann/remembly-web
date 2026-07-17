import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // Form input state - controlled inputs for the login form
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // The JWT we get back after a successful login. null means "not logged in".
  const [token, setToken] = useState(null)

  // The list of memories fetched from the API. Starts empty until loaded.
  const [memories, setMemories] = useState([])

  // Runs automatically whenever `token` changes (including the first render).
  // Since token starts as null, the fetch is skipped until login succeeds.
  useEffect(() => {
    if (!token) return

    async function fetchMemories() {
      try {
        const response = await fetch('https://remembly-production.up.railway.app/memories', {
          headers: { 'Authorization': `Bearer ${token}` },
        })
        const data = await response.json()
        setMemories(data)
      } catch (err) {
        console.error('Failed to fetch memories:', err)
      }
    }

    fetchMemories()
  }, [token])

  // Runs when the login form is submitted
  async function handleLogin(e) {
    e.preventDefault()

    try {
      const response = await fetch('https://remembly-production.up.railway.app/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.token) {
        setToken(data.token)
      } else {
        console.error('Login failed:', data.error)
      }
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  return (
    <div>
      <h1>Remembly</h1>

      {token ? (
        // Logged in: show the memories feed
        <div>
          <p>You're logged in!</p>
          <ul>
            {memories.map((memory) => (
              <li key={memory.id}>
                {memory.caption}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        // Not logged in: show the login form
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
      )}
    </div>
  )
}

export default App