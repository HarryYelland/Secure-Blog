import { useState, useEffect } from "react";
import Axios from "axios";

const submit = () => {
  
};

// Main function for adding a product to a sales order page
function TwoFactorCheck() {  
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
