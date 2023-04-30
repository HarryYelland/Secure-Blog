//https://blog.logrocket.com/getting-started-with-postgres-in-your-react-app/

import React, {useState, useEffect} from 'react';

function TestPosts() {
  const [posts, setPosts] = useState(false);
  var allPosts = [];
  useEffect(() => {
    getPosts();
  }, []);
  function getPosts() {
    fetch('http://localhost:3001/all-posts')
      .then(response => {
        response.json()
        .then(function(data) {
          //console.log(data);
          for (let i = 0; i < data.length; i++) {
            allPosts.push([data[i].post_id, data[i].username, data[i].post_title, data[i].post_body]);
          }
        })
      })
    console.log(allPosts);
  }
  return (
    <div>
      {allPosts.toString() ? allPosts.toString() : 'There is no post data available'}
    </div>
  );
}
export default TestPosts;