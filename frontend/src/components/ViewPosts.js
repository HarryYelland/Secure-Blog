//https://blog.logrocket.com/getting-started-with-postgres-in-your-react-app/

import React, {useState, useEffect} from 'react';

function ViewPost(id){
  console.log("User selected to view " + id);
  sessionStorage.setItem("postid", id);
  if(window.confirm("View post: " + id + "?")){
    window.location.href = "/post";
  } else {
    console.log("Post viewing cancelled")
  }
}


function ViewPosts() {
  sessionStorage.setItem("postid", -1);
  const [posts, setPosts] = useState(false);
  var allPosts = {};
  const [post1, setPost1] = useState([]);
  const [post2, setPost2] = useState([]);
  const [post3, setPost3] = useState([]);
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
          var text = JSON.stringify(posts[0].title);
          //console.log(text);
          try {
            setPost1([
              JSON.stringify(posts[0].title),
              JSON.stringify(posts[0].username),
              JSON.stringify(posts[0].body),
              JSON.stringify(posts[0].postid)
            ]);
          setPost2([
              JSON.stringify(posts[1].title),
              JSON.stringify(posts[1].username),
              JSON.stringify(posts[1].body),
              JSON.stringify(posts[1].postid)
            ]);
           setPost3([
              JSON.stringify(posts[2].title),
              JSON.stringify(posts[2].username),
              JSON.stringify(posts[2].body),
              JSON.stringify(posts[2].postid)
            ]);
          } catch (error) {
            
          }
          
        })
      })
    //console.log(text)
    
  }, [posts]);
  return (
    <div>
      <a href="/post">Make a post</a>
      <h2>View The Latest Posts</h2>
      <br/>
      <div>
        <h3>{post1[0]}</h3>
        <h4>By {post1[1]}</h4>
        <p>{post1[2]}</p>
        <input type="button" value="View Post" onClick={(e) => ViewPost(post1[3])}/>
      </div>
      <br/>
      <br/>
      <div>
        <h3>{post2[0]}</h3>
        <h4>By {post2[1]}</h4>
        <p>{post2[2]}</p>
        <input type="button" value="View Post" onClick={(e) => ViewPost(post2[3])}/>
      </div>
      <br/>
      <br/>
      <div>
        <h3>{post3[0]}</h3>
        <h4>By {post3[1]}</h4>
        <p>{post3[2]}</p>
        <input type="button" value="View Post" onClick={(e) => ViewPost(post3[3])}/>
      </div>
      <br/>
      <br/>
      <a href="/post">Make a post</a>
    </div>
  )
 
   
}
export default ViewPosts;