import { useState, useEffect } from "react";
import Axios from "axios";
//import { ReCAPTCHA } from "react-google-recaptcha";

var bot = true;

const submit = () => {
  //if(bot == false){
    alert("Submitting post...");
    Axios.post("http://localhost:3001/add-post", {
        postTitle: document.getElementById("postTitle").value,
        postText: document.getElementById("postText").value,
        privacy: document.querySelector('input[name="privacyval"]:checked').value
    }).then((response) => {
      console.log(response);
      alert("Post submitted!");
    });
  //} else {
  //  alert("Please complete recaptcha");
  //}
};

function verify(){
  bot = true;
}

function AddPost() {  
  return (
    <div>
      <h2>Make a new post!</h2>
      <form>
        <label for="postTitle">Make a title!</label><br/>
        <input type="text" id="postTitle"/><br/>
        <br/>
        <label for="postText" placeholder="Type anything here! (within reason lol)">Post something here!</label><br/>
        <textarea id="postText" placeholder="Type anything here! (within reason lol)" cols="40" rows="10"></textarea>
        <br/>
          <label for="private1">Private post</label>
          <input type="radio" id="private1" name="privacyval" value="private"></input><br/>
          <label htmlFor="private2">Public post</label>
          <input type="radio" id="private2" name="privacyval" value="notprivate"></input><br/>
        <button type="submit" id="postSubmit" onClick={submit}>Submit</button>
    </form>
        <br/>
        <a href ="/view-all">See all posts!</a>
  </div>
  );
}

export default AddPost;
