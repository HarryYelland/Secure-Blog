import React, {Fragment, useState, useEffect} from 'react';
import './style.css';
import Axios from "axios";

const deletePost = async (e) => {
    Axios.post("https://localhost:3001/delete-post", {
        postID: e
    }).then((response) => {
        console.log(response);
        alert("Post deleted");
    });
}
function SearchPosts() {
    const [posts, setPosts] = useState([])
    const [refreshes, setRefreshes] = useState(0)
    const session = sessionStorage.getItem("session");
    
    const onLoad = async () => {
      console.log("onload")
      //e.preventDefault();
      try {
        const response = await fetch(`http://localhost:3001/my-posts/?session=${session}`);
        const parseResponse = await response.json();
        const thisUser = await window.sessionStorage.getItem("session")

        //console.log(parseResponse);
        setPosts(parseResponse);
        setRefreshes(1);
      } catch (error) {
        console.error(error.message)
      }
    }

    if(refreshes === 0){
      onLoad();
    }

    function returnPostID(pid){
        console.log(pid);
        return document.getElementById("test").textContent = pid;
    };

    return (
      <Fragment>
        <a href="/post">Make a post</a>
        <a href="/view-all">View all posts</a>
        <a href="/search">Search Posts</a>
        <a href="/my-posts">My Posts</a>
        <h2>Searched Posts</h2>
        <br/>
        <div className='container'>
        <table>
          <thead>
            <tr>
              <th>Post Number</th>
              <th>Post Title</th>
              <th>Post Body</th>
              <th>Author</th>
            </tr>
          </thead>
          <tbody>
              {
                posts.map(post => (
                  <tr>
                    <td>{post.post_id}</td>
                    <td>{post.post_title}</td>
                    <td>{post.post_body}</td>
                    <td>{post.username}</td>
                      <button onClick={e => returnPostID(post.post_id)}>Display Post ID</button>
                      <button onClick={e => deletePost(post.post_id)}>Delete Post</button>
                  </tr>
                ))
              }
          </tbody>
        </table>
        </div>
          <p id="test">POSTS</p>
      </Fragment>
    )   
}
export default SearchPosts;