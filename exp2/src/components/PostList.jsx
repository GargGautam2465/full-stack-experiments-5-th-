import { useState } from "react";
import { useSelector } from "react-redux";
import PostCard from "./PostCard";

function PostList() {
  const posts = useSelector(
    (state) => state.posts.posts
  );
  const platforms = useSelector((state) => state.platforms.list);
  const [selectedPlatform, setSelectedPlatform] = useState("All");

  const filteredPosts = selectedPlatform === "All"
    ? posts
    : posts.filter((post) => post.platform === selectedPlatform);

  return (
    <div className="posts-section">
      <div className="posts-heading">
        <h2>All Posts</h2>

        <select
          className="post-filter"
          value={selectedPlatform}
          onChange={(event) => setSelectedPlatform(event.target.value)}
          aria-label="Filter posts by platform"
        >
          <option value="All">All platforms</option>
          {platforms.map((platform) => (
            <option key={platform} value={platform}>{platform}</option>
          ))}
        </select>
      </div>

      <p className="filter-count">
        {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""} shown
      </p>

      {filteredPosts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
        />
      ))}

      {filteredPosts.length === 0 && (
        <p className="empty-posts">No posts found for this platform.</p>
      )}

    </div>
  );
}

export default PostList;
