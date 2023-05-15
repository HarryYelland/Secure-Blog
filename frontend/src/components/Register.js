import { useState, useEffect } from "react";
import Axios from "axios";

const submit = () => {
  if(document.getElementById("password").value !== document.getElementById("confirmPassword").value) {
    alert("Passwords do not match!");
    return;
  }
  alert("Submitting details...");
  Axios.post("http://localhost:3001/duplicate-user", {
    username: document.getElementById("username").value
  }).then((response) => {
    alert(response.status);
  })

  Axios.post("http://localhost:3001/add-user", {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
    email: document.getElementById("email").value,
  }).then((response) => {
    var data = response;
    sessionStorage.setItem("session", data.data);
    console.log(data.data);
    alert("New User Created: " + data);
    //console.log(sessionStorage.getItem("session"));
  });
};

function AddUser() {  
  return (
    <div>
      <h2>Register New Account</h2>
      <form>
        <label for="username">Username</label><br/>
        <input type="text" id="username"/><br/>
        <br/>
        <label for="email">Email</label><br/>
        <input type="email" id="email"/><br/>
        <br/>
        <label for="password" placeholder="Password">Password</label><br/>
        <input id="password" placeholder="Password" type="password"></input>
        <br/>
        <label for="confirmPassword" placeholder="Confirm Password">Confirm Password</label><br/>
        <input id="confirmPassword" placeholder="Re-type Password" type="password"></input>
        <button type="submit" id="userSubmit" onClick={submit}>Submit</button>
    </form>
    <h3>Already have an account?</h3>
    <a href="/">Login Here!</a>
  </div>
  );
}

export default AddUser;
