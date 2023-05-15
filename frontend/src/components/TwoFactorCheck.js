import { useState, useEffect } from "react";
import Axios from "axios";

const submit = () => {
  alert("Submitting Code");
  Axios.post("http://localhost:3001/check-2fa", {
    session: sessionStorage.getItem("session"),
    code: document.getElementById("2fa")
  }).then((response) => {
    
  });
  window.location.href("/view")
};

// Main function for adding a product to a sales order page
function TwoFactorCheck() {
  var sessionid = sessionStorage.getItem("session");
  if(sessionid === ""){
    window.location.href = "/";
  }
  //Axios.post("http://localhost:3001/create-2fa",{
  //  session: sessionid 
  //});
  return (
    <div>
      <h2>Enter 2 FA Code</h2>
      <p>A 2 Factor Authentication code has been emailed to you, please enter this code below:</p>
      <form>
        <label for="2fa">Code</label><br/>
        <input type="text" id="2fa"/><br/>
        <br/>
        <button type="submit" id="userSubmit" onClick={submit}>Submit</button>
      </form>
    </div>
  );
}

export default TwoFactorCheck;
