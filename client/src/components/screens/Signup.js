import React, {useState,useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';


const Signup = () => {
    const history = useHistory();
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [image, setImage] = useState("")
    const [url,setUrl] = useState(undefined)

    useEffect(() => {
        if (url) {
            uploadFileds()
        }
    },[url])

    const uploadPic = () => {
        const data = new FormData() 
        data.append("file", image)
        data.append("upload_preset", "insta-clone")
        data.append("cloud_name", "student")
        fetch("https://api.cloudinary.com/v1_1/ajibolarilwan14/image/upload", {
            method: "post",
            body: data
        })
        .then(res=> res.json())
        .then(data => {
            // console.log(data);
            setUrl(data.url)
            
        })
        .catch(err => {
            console.log(err);
            
        })
    }

    const uploadFileds = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({html: "Invalid Email", classes:"#c62828 red darken-2"})
            return;
        }
        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email,
                pic:url
            })
        }).then(res => res.json())
        .then(data => {
            if(data.error) {
                M.toast({html: data.error, classes:"#c62828 red darken-2"})
            }else{
                M.toast({html: data.message, classes:"#43a047 green darken-1"})
                history.push("/signin");
                // window.location.href = "http://localhost:3000/signin"
            }
            
        }).catch(err => {
            console.log(err);
        })
    }

    const Postdata = () => {
        if(image){
            uploadPic()
        }else{
            uploadFileds()
        }
    }

    return(
        <div className="mycard">
            <div className="card auth-card input-field">
            <h2>Instagram</h2>
            <input 
            type="text"
            placeholder="enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            />

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
            <div className="file-field input-field">
                <div className="btn #64b5f6 blue lighten-2">
                    <span>Upload your pic</span>
                    <input type="file" onChange={(e)=> setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <a className="waves-effect waves-light btn #64b5f6 blue lighten-2" 
            onClick={() => Postdata()}>
            SIGNUP</a>
            <h5>Already have an account?</h5>
            <h6> <Link to="/signin">Sign in here!</Link> </h6>
            </div>

      </div>
    )
}

export default Signup;