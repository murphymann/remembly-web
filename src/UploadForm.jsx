import { useState } from 'react'

function UploadForm({ token, familyGroupId, onUploadSuccess }) {
  const [caption, setCaption] = useState('')
  const [photoFile, setPhotoFile] = useState(null)

  async function handleUpload(e) {
    e.preventDefault()

    if (!photoFile) {
      console.error('Please select a photo')
      return
    }

    const formData = new FormData()
    formData.append('family_group_id', familyGroupId)
    formData.append('caption', caption)
    formData.append('photo', photoFile)

    try {
      const response = await fetch('https://remembly-production.up.railway.app/memories', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      })

      const data = await response.json()
      onUploadSuccess(data)
      setCaption('')
      setPhotoFile(null)
    } catch (err) {
      console.error('Upload failed:', err)
    }
  }

  return (
    <form onSubmit={handleUpload} className="upload-form">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPhotoFile(e.target.files[0])}
      />
      <input
        type="text"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Caption"
        className="input-field"
      />
      <button type="submit" className="submit-button">Upload memory</button>
    </form>
  )
}

export default UploadForm