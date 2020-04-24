import React, {useState, useContext} from 'react';
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';
import {userContext} from '../../App';

const Signin = () => {
    const history = useHistory();
    const {state, dispatch} = useContext(userContext)
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const Postdata = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({html: "Invalid Email", classes:"#c62828 red darken-2"})
            return;
        }
        fetch("/signin", {
            method: "post",
            headers: {
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                email
            })
        }).then(res => res.json())
        .then(data => {
            // console.log(data);
            
            if(data.error) {
                M.toast({html: data.error, classes:"#c62828 red darken-2"})
            }else{
                localStorage.setItem("jwt", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                dispatch({type:"USER", payload:data.user})
                M.toast({html: "sign in successfully", classes:"#43a047 green darken-1"})
                history.push("/");
                // window.location.href = "http://localhost:3000"
            }
            
        }).catch(err => {
            console.log(err);
        })
    }
    return(
        <div className="mycard">
            <div className="card auth-card input-field">
            <h2>Instagram</h2>
            <input 
            type="text"
            placeholder="enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />

            <input
            type="password"
            placeholder="enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <button className="waves-effect waves-light btn #64b5f6 blue lighten-2" 
            onClick={() => Postdata()}>
            SIGNIN
            </button>
            <h5>Don't have an account?</h5>
            <h6> <Link to="/signup">Sign up here!</Link> </h6>
            </div>
      </div>
    )
}

export default Signin;