//https://blog.logrocket.com/getting-started-with-postgres-in-your-react-app/

import React, {useState, useEffect} from 'react';

function TestPosts() {
  const [posts, setPosts] = useState(false);
  var allPosts = {};
  useEffect(() => {
    getPosts();
  }, []);
  async function getPosts() {
    fetch('http://localhost:3001/all-posts')
      .then(response => {
        response.json()
        .then(function(data) {
          //console.log(data);
          for (let i = 0; i < data.length; i++) {
            allPosts[i] = {"postid": data[i].post_id, "username": data[i].username, "title": data[i].post_title, "body": data[i].post_body};
          }
        })
      })
    await console.log(allPosts);
  }
  return (
    <div>
      <h1>The Football Blog</h1>
      {JSON.stringify(allPosts)}
    </div>
  );
}
export default TestPosts;