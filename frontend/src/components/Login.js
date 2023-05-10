import { useState, useEffect } from "react";
import Axios from "axios";

// Function to handle submitting item to sales order
const submit = () => {
  Axios.get("http://localhost:3000/login-user", {
    username: document.getElementById("username").value,
  });
  
};

// Main function for adding a product to a sales order page
function Login() {  
  return (
    <div>
      <h2>Login</h2>
      <form>
        <label for="username">Username</label><br/>
        <input type="text" id="username"/><br/>
        <br/>
        <label for="password" placeholder="Password">Password</label><br/>
        <input id="password" placeholder="Password" type="password"></input>
        <br/>
        <button type="submit" id="userSubmit" onClick={submit}>Login</button>
    </form>
    <h3>New User?</h3>
    <a href="/register">Register Here!</a>
  </div>
  );
}

export default Login;
