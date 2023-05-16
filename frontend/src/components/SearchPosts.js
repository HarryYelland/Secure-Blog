import Axios from "axios";
import React, {useState, useEffect} from 'react';

function SearchPosts() {
    sessionStorage.setItem("search", "test");
    var search = {"search": sessionStorage.getItem("search")};
    async function postJSON(data) {
        try {
          const response = await fetch("http://localhost:3001/search-posts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
      
          const result = await response.json();
          console.log("Success:", result);
        } catch (error) {
          console.error("Error:", error);
        }
      }
      postJSON(search);
    
    return (
        <div>
        <a href="/post">Make a post</a>
        <h2>Searched Posts</h2>
        <br/>
        </div>
    )   
}
export default SearchPosts;