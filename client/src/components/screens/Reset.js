import React, {useState, useContext} from 'react';
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';

const ResetPassword = () => {
    const history = useHistory();
    const [email, setEmail] = useState("")
    const Postdata = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({html: "Invalid Email", classes:"#c62828 red darken-2"})
            return;
        }
        fetch("/reset-password", {
            method: "post",
            headers: {
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email
            })
        }).then(res => res.json())
        .then(data => {
            // console.log(data);
            
            if(data.error) {
                M.toast({html: data.error, classes:"#c62828 red darken-2"})
            }else{
                M.toast({html: data.message, classes:"#43a047 green darken-1"})
                // history.push("/signin");
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

                <button className="waves-effect waves-light btn #64b5f6 blue lighten-2" 
                onClick={() => Postdata()}>
                Reset Password
                </button>
            </div>
      </div>
    )
}

export default ResetPassword;