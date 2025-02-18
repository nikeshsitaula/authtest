import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      //   const accessToken = getCookie("accessToken");

      try {
        const response = await fetch("http://localhost:3000/posts", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        } else {
          setError("Failed to fetch posts.");
        }
      } catch (err) {
        setError("An error occurred while fetching posts.");
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <p>Welcome to the Dashboard!</p>

      {error && <p>{error}</p>}

      <div>
        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          posts.map((post, index) => (
            <div key={index}>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
