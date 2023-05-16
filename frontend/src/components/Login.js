import React, {Fragment, useState, useEffect} from 'react';
import './style.css';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [response, setResponse] = useState("")
    
    const onSubmitForm = async (e) => {
      e.preventDefault();
      try {
        const rawResponse = await fetch(`http://localhost:3001/login-user/?user=${username}&pass=${password}`);
        const parseResponse = await rawResponse.json();

        //console.log(parseResponse);
        setResponse(parseResponse.message);
        await sessionStorage.setItem("session", parseResponse.session);
        window.location.href="/2FA";
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
            <input type="text" name="password"
            placeholder="password"
            className='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            />
            <button className="btn">Submit</button>
          </form>
          <br/>
        </div>
      </Fragment>
    )   
}
export default Login;