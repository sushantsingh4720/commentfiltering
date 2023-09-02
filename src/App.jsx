import React, { useEffect, useState } from "react";
import "./App.scss";
import axios from "axios";
function App() {
  const [allComments, setAllComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postIdFilter, setPostIdFilter] = useState(null);
  const [filteredPost, setFilteredPost] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);

  const commentHandler = (postId) => {
    setFilteredComments(
      allComments.filter((comment) => comment.postId === parseInt(postId))
    );
  };

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/comments")
      .then((response) => {
        setAllComments(response.data.slice(0, 100)); // Limit to the first 100 comments
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  }, []);

  useEffect(() => {
    // Create an empty array to store the first comments
    const firstComments = [];
    // Create an object to keep track of which posts have been processed
    const processedPosts = {};
    for (const comment of allComments) {
      const postId = comment.postId;

      // Check if the post has already been processed
      if (!processedPosts[postId]) {
        // If not, add the comment to the firstComments array
        firstComments.push(comment);

        // Mark the post as processed
        processedPosts[postId] = true;
      }
    }
    setPosts(firstComments);
  }, [allComments]);

  useEffect(() => {
    setFilteredComments([]);

    if (postIdFilter) {
      setFilteredPost(
        posts.filter((post) => post.postId === parseInt(postIdFilter))
      );
    }
  }, [postIdFilter]);

  return (
    <div className="app">
      <div className="left">
        <select onChange={(e) => setPostIdFilter(e.target.value)}>
          <option value="" hidden>
            choose postId
          </option>
          {posts.map((post) => (
            <option value={post.postId} key={post.postId}>
              {post.postId}
            </option>
          ))}
        </select>
        <div className="posts">
          {(postIdFilter ? filteredPost : posts).map((post) => (
            <span
              key={post.postId}
              onClick={() => postIdFilter && commentHandler(post.postId)}
            >
              {post.body}
            </span>
          ))}
        </div>
      </div>
      <div className="right">
        {filteredComments.map((comment) => (
          <span key={comment.id}>{comment.body}</span>
        ))}
      </div>
    </div>
  );
}

export default App;
