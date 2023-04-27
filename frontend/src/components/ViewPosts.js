import { useState, useEffect } from "react";
import Axios from "axios";
import Post from "./Post";

var POSTS = [];



// Main function for adding a product to a sales order page
function ViewPosts() { 
  console.log("Viewing posts...");
  Axios.get("http://localhost:3001/all-posts", {
  }).then((response) => {
    console.log(response);
    for (let i = 0; i < response.length; i++) {
      POSTS.push([response.data[i].Post_Title, response.data[i].Post_Body]);
    }
  });
  return (
    <div>
      {POSTS.map(post => (
          <Post source={post} key={post} />
        ))}
  </div>
  );
}

export default ViewPosts;
