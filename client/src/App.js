import React, {useEffect, createContext, useReducer, useContext} from 'react';
import NavBar from './components/Navbar';
import './App.css';
import {BrowserRouter, Route, Switch, useHistory} from 'react-router-dom';
import Home from './components/screens/Home';
import Signin from './components/screens/Signin';
import Signup from './components/screens/Signup';
import Profile from './components/screens/Profile';
import CreatePost from './components/screens/createPost';
import {reducer, initialState} from './reducers/userReducer';
import UserProfile from './components/screens/UserProfile';
import SubscribeUserPost from './components/screens/SubscribeUserPost'

export const userContext = createContext();


const Routing = () => {
  const history = useHistory();
  const {state,dispatch} = useContext(userContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      dispatch({type:"USER",payload:user})
      // history.push("/")
    } else {
      history.push("/signin")
    }
    // console.log(user);
    
  },[])
  return(
    <Switch>
    <Route exact path="/">
        <Home />
      </Route>

      <Route path="/signin">
        <Signin />
      </Route>

      <Route path="/signup">
        <Signup />
      </Route>

      <Route exact path="/profile">
        <Profile />
      </Route>

      <Route path="/create">
        <CreatePost />
      </Route>
      
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>

      <Route path="/myfollowerspost">
        <SubscribeUserPost />
      </Route>

    </Switch>

  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <userContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
      <NavBar />
      <Routing />
    </BrowserRouter>
    </userContext.Provider>
  );
}

export default App;
