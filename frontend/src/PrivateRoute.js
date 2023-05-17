import {Outlet, useNavigate } from 'react-router-dom'
import Axios from "axios";

const PrivateRoutes = () => {
    //let auth = {'token': true}
    const navigate = useNavigate();
    const check = () => {
        Axios.post("http://localhost:3001/check-session", {
            session: sessionStorage.getItem("session"),
        }).then((response) => {
            //console.log(response);
            var auth = response.data
            if(auth.toString() === "true"){
                console.log("Verified")
                return <Outlet/>
            } else if (auth.toString() === "auth"){
                navigate('/2FA');
            }else{
                navigate('/');
            }
        });
      };
    check();

    
}

export default PrivateRoutes;