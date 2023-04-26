import { useState, useEffect } from "react";
import Axios from "axios";

// Function to handle submitting item to sales order
const submit = () => {
  alert("Submitting post...");
  // POST request to the backend to submit the item to the sales order
  Axios.post("http://localhost:3001/add-post", {
    postTitle: document.getElementById("postTitle").value,
    postText: document.getElementById("postText").value
  }).then((response) => {
    console.log(response);
    alert("Post submitted!");
    // Reload the page
    //window.location.href = "/";
  });
};

// Main function for adding a product to a sales order page
function AddPost() {  
  return (
    <div>
      <h2>New post!</h2>
      <form>
        <label for="postTitle">Make a title!</label><br/>
        <input type="text" id="postTitle"/><br/>
        <br/>
        <label for="postText" placeholder="Type anything here! (within reason lol)">Post something here!</label><br/>
        <textarea id="postText" placeholder="Type anything here! (within reason lol)" cols="40" rows="10"></textarea>
        <br/>
        <button type="submit" id="postSubmit" onClick={submit}>Submit</button>
    </form>
  </div>
  );
}

export default AddPost;
