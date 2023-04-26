import { useState, useEffect } from "react";
import Axios from "axios";

// Function to handle submitting item to sales order
const submit = () => {
  if(document.getElementById("password").value !== document.getElementById("confirmPassword").value) {
    alert("Passwords do not match!");
    return;
  }
  alert("Submitting details...");
  // POST request to the backend to submit the item to the sales order
  Axios.post("http://localhost:3001/add-user", {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
    email: document.getElementById("email").value,
  }).then((response) => {
    console.log(response);
    alert("User Created!");
    // Reload the page
    //window.location.href = "/";
  });
};

// Main function for adding a product to a sales order page
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
  </div>
  );
}

export default AddUser;
