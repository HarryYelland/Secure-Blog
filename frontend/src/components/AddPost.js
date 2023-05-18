import { useState, useEffect } from "react";
import Axios from "axios";
import { ReCAPTCHA } from "react-google-recaptcha";

function AddPost() { 
const [captcha, setCaptcha] = useState(false);
const key = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

const submit = () => {
  //if(bot == false){
    alert("Submitting post...");
    Axios.post("http://localhost:3001/add-post", {
        postTitle: document.getElementById("postTitle").value,
        postText: document.getElementById("postText").value,
        session: window.sessionStorage.getItem("session"),
        privacy: document.querySelector('input[name="privacyval"]:checked').value
    }).then((response) => {
      console.log(response);
      alert("Post submitted!");
    });
  //} else {
  //  alert("Please complete recaptcha");
  //}
};

function onChange(){
  setCaptcha(true);
}

 
  return (
    <div>
        <a href="/post">Make a post</a>
        <a href="/view-all">View all posts</a>
        <a href="/search">Search Posts</a>
        <a href="/my-posts">My Posts</a>
      <h2>Make a new post!</h2>
      <form>
        <label for="postTitle">Make a title!</label><br/>
        <input type="text" id="postTitle"/><br/>
        <br/>
        <label for="postText" placeholder="Type anything here!">Post something here!</label><br/>
        <textarea id="postText" placeholder="Type anything here!" cols="40" rows="10"></textarea>
        <br/>
          <label for="private1">Private post</label>
          <input type="radio" id="private1" name="privacyval" value="private" required></input><br/>
          <label htmlFor="private2">Public post</label>
          <input type="radio" id="private2" name="privacyval" value="notprivate"></input><br/>
          <ReCAPTCHA
            sitekey={key}
            render="explicit"
            onloadCallback={onChange}
          />
        <button type="submit" id="postSubmit" onClick={submit}>Submit</button>
    </form>
        <br/>
        <a href ="/view-all">See all posts!</a>
  </div>
  );
}

export default AddPost;
