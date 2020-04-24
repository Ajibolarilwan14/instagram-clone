import React, {useEffect,useState,useContext} from 'react';
import {userContext} from '../../App';
import {useParams} from 'react-router-dom';

const Profile = () => {
    const [userProfile, setProfile] = useState(null)
    const {state, dispatch} = useContext(userContext)
    const {userid} = useParams()
    // console.log(state);
    const [showFollow, setShowFollow] = useState(state? !state.following.includes(userid):true)
    useEffect(()=> {
        fetch(`/user/${userid}`, {
            headers:{
                "Authorization":`Bearer ${localStorage.getItem("jwt")}`
            }
        }).then(res=>res.json())
        .then(result=> {
            console.log(result);
            setProfile(result)
            // setPics(result.mypost)
            
        })
    },[])

    const followUser = () => {
        fetch('/follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res => res.json())
        .then(result => {
            // console.log(result);
            dispatch({type:"UPDATE",payload:{following:result.following,followers:result.followers}})
            localStorage.setItem("user",JSON.stringify(result));
            setProfile((prevState)=> {
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,result._id]
                    }
                }
            })
            setShowFollow(false)
            
        }).catch(err => {
            console.log(err);
            
        })
    }

    const unFollowUser = () => {
        fetch('/unfollow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res => res.json())
        .then(result => {
            // console.log(result);
            dispatch({type:"UPDATE",payload:{following:result.following,followers:result.followers}})
            localStorage.setItem("user",JSON.stringify(result));
            setProfile((prevState)=> {
                const newFollower = prevState.user.followers.filter(item=>item != result._id)
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        // followers:[...prevState.user.followers,result._id]
                        followers: newFollower
                    }
                }
            })   
            setShowFollow(true)         
            window.location.reload()
        }).catch(err => {
            console.log(err);
            
        })
    }

    return(
        <>
        {userProfile ?
        <div style={{maxWidth:"550px", margin:"0px auto"}}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid grey"
            }}>
                <div>
                    <img style={{width:"160px", height:"160px", borderRadius:"80px"}}
                    src={userProfile.user.pic}
                    />
                </div>
                <div>
                    <h4>{userProfile.user.name}</h4>
                    <h5>{userProfile.user.email}</h5>
                    <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                        <h6>{userProfile.posts.length} posts </h6>
                        <h6> {userProfile.user.followers.length} followers </h6>
                        <h6> {userProfile.user.following.length} following </h6>
                        {showFollow 
                        ?
                        <button style={{margin:"10px"}} className="waves-effect waves-light btn #64b5f6 blue lighten-2" 
                        onClick={()=> followUser()}>
                        Follow
                        </button>
                        :
                        <button style={{margin:"10px"}} className="waves-effect waves-light btn #64b5f6 blue lighten-2" 
                        onClick={()=> unFollowUser()}>
                        Unfollow
                        </button>
                        }
                    </div>
                </div>
            </div>
            
            <div className="gallery">
            {
                userProfile.posts.map(item=> {
                    return(
                <img key={item._id} className="item" src={item.photo} alt={item.title} />
                    )
                })
            }
            </div>
        </div>
        
         : 
         <h2>Loading...</h2>
         }
        </>
    )
}

export default Profile;