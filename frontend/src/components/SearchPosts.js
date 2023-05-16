import React, {Fragment, useState, useEffect} from 'react';
import './style.css';

function SearchPosts() {
    const [searches, setSearches] = useState("");
    const [posts, setPosts] = useState([])
    
    const onSubmitForm = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(`http://localhost:3001/search-posts/?search=${searches}`);
        const parseResponse = await response.json();

        //console.log(parseResponse);
        setPosts(parseResponse);
      } catch (error) {
        console.error(error.message)
      }
    }

    return (
      <Fragment>
        <a href="/post">Make a post</a>
        <h2>Searched Posts</h2>
        <br/>
        <div className='container'>
          <form onSubmit={onSubmitForm}>
            <input type="text" name="search"
            placeholder="Search for a post"
            className='search'
            value={searches}
            onChange={e => setSearches(e.target.value)}
            />
            <button className="btn">Submit</button>
          </form>
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