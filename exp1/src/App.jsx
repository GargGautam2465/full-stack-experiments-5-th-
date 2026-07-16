import { useState } from 'react'
import './App.css'

const platforms = {
  X: 280,
  Instagram: 2200,
  LinkedIn: 3000,
  Facebook: 5000,
}

function App() {
  const [post, setPost] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState([])
  const [mediaName, setMediaName] = useState('')

  const togglePlatform = (platform) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter((item) => item !== platform))
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform])
    }
  }

  const invalidPlatforms = selectedPlatforms.filter(
    (platform) => post.length > platforms[platform]
  )

  const canPublish =
    post.trim() !== '' &&
    selectedPlatforms.length > 0 &&
    invalidPlatforms.length === 0

  return (
    <main className="app">
      <section className="composer">
        <h1>Social Media Post Creator</h1>
        <p className="subtitle">Create one post for multiple platforms.</p>

        <label htmlFor="post">Write your post</label>
        <textarea
          id="post"
          value={post}
          onChange={(event) => setPost(event.target.value)}
          placeholder="Write your content here..."
          rows="7"
        />

        <p className="total-count">Total characters: {post.length}</p>

        <h2>Select platforms</h2>

        <div className="platforms">
          {Object.keys(platforms).map((platform) => (
            <label className="platform-card" key={platform}>
              <input
                type="checkbox"
                checked={selectedPlatforms.includes(platform)}
                onChange={() => togglePlatform(platform)}
              />
              <span>
                <strong>{platform}</strong>
                <small>Limit: {platforms[platform]} characters</small>

                {selectedPlatforms.includes(platform) && (
                  <small
                    className={
                      post.length > platforms[platform] ? 'error' : 'success'
                    }
                  >
                    {post.length} / {platforms[platform]}
                    {post.length > platforms[platform]
                      ? ` — Limit exceeded by ${
                          post.length - platforms[platform]
                        }`
                      : ' — Valid'}
                  </small>
                )}
              </span>
            </label>
          ))}
        </div>

        <label className="media-label" htmlFor="media">
          Attach media
        </label>
        <input
          id="media"
          type="file"
          accept="image/*,video/*"
          onChange={(event) =>
            setMediaName(event.target.files[0]?.name || '')
          }
        />

        {mediaName && <p className="media-name">Attached: {mediaName}</p>}

        {invalidPlatforms.length > 0 && (
          <p className="warning">
            Please reduce characters for: {invalidPlatforms.join(', ')}
          </p>
        )}

        <button disabled={!canPublish}>
          {canPublish ? 'Publish Post' : 'Complete required validation'}
        </button>

        <div className="preview">
          <h2>Live Preview</h2>
          <p>{post || 'Your post preview will appear here...'}</p>
          <small>
            Selected: {selectedPlatforms.join(', ') || 'No platform selected'}
          </small>
        </div>
      </section>
    </main>
  )
}

export default App