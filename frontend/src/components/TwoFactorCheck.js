import { useState, useEffect } from "react";
import Axios from "axios";


// Main function for adding a product to a sales order page
function TwoFactorCheck() {
  const [session, setSession] = useState("");
  const [code, setCode] = useState("");

  var sessionid = window.sessionStorage.getItem("session");
  if(session !== sessionid){
    setSession(sessionid);
  }
  
  const submit = async (e) => {
    e.preventDefault();
    try {

      if(session === ""){
        window.location.href = "/";
      }
      const rawResponse = await fetch(`http://localhost:3001/check-2fa/?session=${session.toString()}&code=${code.toString()}`);
      const message = rawResponse.message
      console.log(message)
      if(message.toString() === "Code Matches"){
        window.location.href ="/view-all";
      }
    } catch (error) {
      console.error(error.message)
    }
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
            
      if(session === ""){
        window.location.href = "/";
      }
      const rawResponse = await fetch(`http://localhost:3001/2FA?session=${session}`);
      const message = rawResponse.message
      console.log(message)
    } catch (error) {
      console.error(error.message)
    }
  }

  
  
  return (
    <div>
      <h2>Enter 2 FA Code</h2>
      <p>A 2 Factor Authentication code has been emailed to you, please enter this code below:</p>
      <form onSubmit={onSubmitForm}>
        <button type="submit" id="code">Send Code To Email</button>
      </form>
      <br/>
      <form onSubmit={submit}>
        <label for="2fa">Code</label><br/>
        <input type="text" id="2fa" value={code} onChange={e => setCode(e.target.value)}/><br/>
        <br/>
        <button type="submit" id="code">Submit Code</button>
      </form>
    </div>
  );
}

export default TwoFactorCheck;
