import {Outlet, useNavigate } from 'react-router-dom'
import Axios from "axios";

const PrivateRoutes = () => {
    //let auth = {'token': true}
    const navigate = useNavigate();
    const check = () => {
        Axios.post("http://localhost:3001/check-session", {
            //session: sessionStorage.getItem("sessionID"),
            session: "1",
        }).then((response) => {
            //console.log(response);
            var auth = response.data
            if(auth.toString() == "true"){
                Axios.post("http://localhost:3001/get-front", {
                    front: "send" + auth
                });
                return <Outlet/>
            }else{
                Axios.post("http://localhost:3001/get-front", {
                    front: "send" + auth
                });
                navigate('/')
            }
        });
      };
    check();

    
}

export default PrivateRoutes;