import React, {useState, useEffect} from 'react';
import M from 'materialize-css';

const CreatePost = () => {
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    useEffect(()=>{
        if(url){
            fetch("/createpost", {
                method: "post",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${localStorage.getItem("jwt")}`
                },
                body:JSON.stringify({
                    title,
                    body,
                    pic: url
                })
            }).then(res => res.json())
            .then(data => {
                // console.log(data);
                
                if(data.error) {
                    M.toast({html: data.error, classes:"#c62828 red darken-2"})
                }else{
                    M.toast({html: "post created successfully", classes:"#43a047 green darken-1"})
                    // history.push("/signin");
                    window.location.href = "http://localhost:3000";
                }
                
            }).catch(err => {
                console.log(err);
            })
        }
    },[url])

    const postDetails = () =>{
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

    return(
        <div className="card input-filed" style={{
            margin:"10px auto",
            maxWidth:"500px",
            padding:"20px",
            textAlign:"center"
        }}>
            <input type="text" 
            placeholder="give your post a title" 
            value={title}
            onChange={(e)=> setTitle(e.target.value)}
            />
            <input type="text" 
            placeholder="give your post a body" 
            value={body}
            onChange={(e)=> setBody(e.target.value)}
            />
            <div className="file-field input-field">
                <div className="btn #64b5f6 blue lighten-2">
                    <span>Upload Image</span>
                    <input type="file" onChange={(e)=> setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <a className="waves-effect waves-light btn #64b5f6 blue lighten-2"
            onClick={()=>postDetails()}
            >Submit post</a>
        </div>
    )
}

export default CreatePost;