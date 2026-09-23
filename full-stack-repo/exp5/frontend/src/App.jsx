import { useState, useEffect } from 'react'
import PostComposer from './PostComposer'
import PostList from './PostList'
import GlobalError from './GlobalError'
import './App.css'

// Vite forwards this path to the Spring Boot server during development.
const API_URL = '/api/posts';

async function request(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed (${response.status})`);
  }
  return response.status === 204 ? null : response.json();
}

function App() {
  const [posts, setPosts] = useState([]);
  const [globalError, setGlobalError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await request(API_URL);
      setPosts(data);
      setGlobalError(null);
    } catch (err) {
      console.error("Failed to fetch posts", err);
      setGlobalError("Could not connect to backend server. Make sure Spring Boot is running on port 8080.");
    }
  };

  const handleCreatePost = async (postData) => {
    try {
      await request(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
      await fetchPosts();
    } catch (err) {
      setGlobalError(err.message || "Failed to create post.");
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await request(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      await fetchPosts();
    } catch (err) {
      setGlobalError("Failed to delete post.");
    }
  };

  const handleUpdatePost = async (id, updatedData) => {
    try {
      await request(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      await fetchPosts();
    } catch (err) {
      setGlobalError("Failed to update post.");
    }
  };

  return (
    <div className="app-container">
      <GlobalError message={globalError} onClose={() => setGlobalError(null)} />
      
      <header className="app-header">
        <h1>OmniPost Composer</h1>
        <p>Write once, publish anywhere. Respects platform word limits.</p>
      </header>
      
      <main className="app-main">
        <PostComposer 
          onPostCreate={handleCreatePost} 
          onError={setGlobalError} 
        />
        <PostList 
          posts={posts} 
          onDelete={handleDeletePost} 
          onUpdate={handleUpdatePost} 
        />
      </main>
    </div>
  )
}

export default App;
