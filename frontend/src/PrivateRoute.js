import {Outlet, useNavigate } from 'react-router-dom'
import Axios from "axios";

const PrivateRoutes = () => {
    //let auth = {'token': true}
    const navigate = useNavigate();
    const check = () => {
        Axios.post("http://localhost:3001/check-session", {
            session: sessionStorage.getItem("session"),
            //session: "0016ff1dd58b242bba7fdf4e68bb74973f66fc677ac4acd96a980f3b8df3d153",
        }).then((response) => {
            //console.log(response);
            var auth = response.data
            if(auth.toString() === "true"){
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