import { useState, useEffect } from "react";
import Axios from "axios";
//import { ReCAPTCHA } from "react-google-recaptcha";

var bot = true;

const submit = () => {
  //if(bot == false){
    alert("Submitting post...");
    Axios.post("http://localhost:3001/add-post", {
      postTitle: document.getElementById("postTitle").value,
      postText: document.getElementById("postText").value
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
