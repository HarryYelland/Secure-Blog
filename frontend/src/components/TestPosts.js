//https://blog.logrocket.com/getting-started-with-postgres-in-your-react-app/

import React, {useState, useEffect} from 'react';

function TestPosts() {
  const [posts, setPosts] = useState(false);
  var allPosts = {};
  const [post1, setPost1] = useState([]);
  useEffect(() => {
    fetch('http://localhost:3001/all-posts')
      .then(response => {
        response.json()
        .then(function(data) {
          //console.log(data);
          for (let i = 0; i < data.length; i++) {
            allPosts[i] = {"postid": data[i].post_id, "username": data[i].username, "title": data[i].post_title, "body": data[i].post_body};
          }
          setPosts(allPosts)
            setPost1([
              JSON.stringify(posts[0].title),
              JSON.stringify(posts[0].username),
              JSON.stringify(posts[0].body)
            ]);
        })
      })
    //console.log(text)
    
  }, [post1]);
  return (
    <div>
      <h1>The Football Blog</h1>
      <h2>The Latest Posts</h2>
      <br/>
      <h3>{post1[0]}</h3>
      <h4>By {post1[1]}</h4>
      <br/>
      <p>{post1[2]}</p>
    </div>
  )
 
   
}
export default TestPosts;