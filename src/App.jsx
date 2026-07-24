import { useState, useEffect } from 'react'
import MemoryCard from './MemoryCard'
import LoginForm from './LoginForm'
import './App.css'

function App() {
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

  return (
    <div className="app">
      <h1>Remembly</h1>

      {token ? (
        // Logged in: show the memories feed
        <div className="feed">
          <p>You're logged in!</p>
          <ul className="memory-list">
            {memories.map((memory) => (
              <MemoryCard key={memory.id} memory={memory} />
            ))}
          </ul>
        </div>
      ) : (
        // Not logged in: show the login form
        <LoginForm onLogin={setToken} />
      )}
    </div>
  )
}

export default App