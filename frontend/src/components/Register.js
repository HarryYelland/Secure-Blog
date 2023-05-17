import React, {Fragment, useState, useEffect} from 'react';
import './style.css';

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [response, setResponse] = useState("")
    
    const onSubmitForm = async (e) => {
      e.preventDefault();
      try {
        if(password === confirmPassword){
          const rawResponse = await fetch(`http://localhost:3001/add-user/?user=${username}&pass=${password}&email=${email}`);
          const parseResponse = await rawResponse.json();
  
          //console.log(parseResponse);
          setResponse(parseResponse.message);
          await window.sessionStorage.setItem("session", parseResponse.session);
          if(window.sessionStorage.getItem("session") !== ""){
            window.location.href="/2FA";
          }
        }
      } catch (error) {
        console.error(error.message)
      }
    }

    return (
      <Fragment>
        <h2>Login</h2>
        <h3>{response}</h3>
        <div className='container'>
          <form onSubmit={onSubmitForm}>
            <input type="text" name="username"
            placeholder="Username"
            className='username'
            value={username}
            onChange={e => setUsername(e.target.value)}
            />
            <input type="text" name="email"
            placeholder="Email"
            className='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            />
            <input type="text" name="password"
            placeholder="Password"
            className='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            />
            <input type="text" name="confirmPassword"
            placeholder="Confirm Password"
            className='confirmPassword'
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            />
            <button className="btn">Submit</button>
          </form>
          <br/>
        </div>
        <a href="/">Already Have An Account?</a>
      </Fragment>
    )   
}
export default Register;