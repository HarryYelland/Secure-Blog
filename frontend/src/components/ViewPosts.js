import React, {Fragment, useState, useEffect} from 'react';
import './style.css';

function EditPost(){};
function SearchPosts() {
    const [posts, setPosts] = useState([])
    const [refreshes, setRefreshes] = useState(0)
    
    const onLoad = async () => {
      console.log("onload")
      //e.preventDefault();
      try {
        const response = await fetch(`http://localhost:3001/all-posts`);
        const parseResponse = await response.json();

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

    const onClick = () => {

    }

    return (
      <Fragment>
        <a href="/post">Make a post</a>
        <a href="/view-all">View all posts</a>
        <a href="/search">Search Posts</a>
        <a href="/my-posts">My Posts</a>
        <h2>View All Posts</h2>
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
                  </tr>
                ))
              }
          </tbody>
        </table>
        </div>
      </Fragment>
    )   
}
export default SearchPosts;