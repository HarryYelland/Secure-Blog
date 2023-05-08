//https://blog.logrocket.com/getting-started-with-postgres-in-your-react-app/

import React, {useState, useEffect} from 'react';

function ViewPosts() {
  const [posts, setPosts] = useState(false);
  var allPosts = {};
  const [post1, setPost1] = useState([]);
  
  const postid = 10;
  const sessionkey = 5;
  //const postid = sessionStorage.getItem("postid");
  //const sessionkey = sessionStorage.getItem("sessionkey");
  useEffect(() => {
    fetch('http://localhost:3001/post', postid, sessionkey)
      .then(response => {
        response.json()
        .then(function(data) {
          //console.log(data);
          for (let i = 0; i < data.length; i++) {
            allPosts[i] = {"postid": data[i].post_id, "username": data[i].username, "title": data[i].post_title, "body": data[i].post_body};
          }
          setPosts(allPosts)
          var text = JSON.stringify(posts[0].title);
          //console.log(text);
          try {
            setPost1([
              JSON.stringify(posts[0].title),
              JSON.stringify(posts[0].username),
              JSON.stringify(posts[0].body),
              JSON.stringify(posts[0].postid)
            ]);
          } catch (error) {
            
          }
          
        })
      })
    //console.log(text)
    
  }, [posts]);
  return (
    <div>
      <a href="/post">Viewing Post {posts[0].postid}</a>
      <h2>View The Latest Posts</h2>
      <br/>
      <div>
        <h3>{post1[0]}</h3>
        <h4>By {post1[1]}</h4>
        <p>{post1[2]}</p>
      </div>
      <br/>
    </div>
  )
 
   
}
export default ViewPosts;