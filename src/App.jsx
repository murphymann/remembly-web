import { useState, useEffect } from 'react'
import MemoryCard from './MemoryCard'
import LoginForm from './LoginForm'
import UploadForm from './UploadForm'
import './App.css'

function App() {
  // The JWT we get back after a successful login. null means "not logged in".
  const [token, setToken] = useState(null)

  // The list of memories fetched from the API. Starts empty until loaded.
  const [memories, setMemories] = useState([])

  // The list of family groups the logged-in user belongs to.
  const [familyGroups, setFamilyGroups] = useState([])

  // Which family group is currently selected (e.g. for the upload form).
  const [selectedGroupId, setSelectedGroupId] = useState('')

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

  // A second, independent effect - also runs when `token` changes,
  // but fetches family groups instead of memories.
  useEffect(() => {
    if (!token) return

    async function fetchFamilyGroups() {
      try {
        const response = await fetch('https://remembly-production.up.railway.app/family-groups', {
          headers: { 'Authorization': `Bearer ${token}` },
        })
        const data = await response.json()
        setFamilyGroups(data)
        if (data.length > 0) {
          setSelectedGroupId(data[0].id)
        }
      } catch (err) {
        console.error('Failed to fetch family groups:', err)
      }
    }

    fetchFamilyGroups()
  }, [token])

  // Called by UploadForm after a memory is successfully created.
  // Adds the new memory to the front of the existing list, so it
  // appears immediately without needing to re-fetch everything.
  function handleUploadSuccess(newMemory) {
    setMemories((prevMemories) => [newMemory, ...prevMemories])
  }

  return (
    <div className="app">
      <h1>Remembly</h1>

      {token ? (
        // Logged in: show the memories feed
        <div className="feed">
          <p>You're logged in!</p>

          <select
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
          >
            {familyGroups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>

          <UploadForm
            token={token}
            familyGroupId={selectedGroupId}
            onUploadSuccess={handleUploadSuccess}
          />

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