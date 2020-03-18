import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
firebase.initializeApp(firebaseConfig);

function App() {
  const [user,setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    error: '',
    photo: '',
    existingUser: false,
    isValid: false,
  });
  const provider = new firebase.auth.GoogleAuthProvider();

  //Onclick function
  const signIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then((result) => {
      const {displayName,photoURL,email} = result.user;
      //created an object with credentials
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL,
      }
      setUser(signedInUser);
    })
    .catch(error => {
      console.log(error);
      console.log(error.message);
    })
  }

  //Sign Out
  const signOut = () => {
    firebase.auth().signOut()
    .then(response => {
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        email: '',
        password: '',
        photo: ''
      }
      setUser(signedOutUser);
    })
    .catch(error => {

    });
  }

  //Form validation
  const formValidation = e => /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(e);
  //get Data
  const handleChange = e =>{
    //Get All properties of user
    const newUserInfo = {
      ...user
    }
    //Perform validation
    let isValid = true;
    if (e.target.name === 'email') {
      isValid = formValidation(e.target.value);
    }
    if (e.target.name === 'password') {
      isValid = e.target.value.length > 8;
    }
    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  }
  //Returning User
  const switchForm = e => {
    const createdUser = {...user};
    createdUser.existingUser = e.target.checked;
    setUser(createdUser);
  }
  //Create Account
  const createAccount = (event) => {
    if (user.isValid) {
      firebase.auth().createUserWithEmailAndPassword(user.email,user.password)
      .then(response => {
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        setUser(createdUser);
      })
      .catch(err => {
        console.log(err);
        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.error = err.message;
        setUser(createdUser);
      })
    }else{
      console.log("Form is not valid.");
    }
    event.preventDefault();
    event.target.reset();
  }

  //Sign in user

  const signInUser = event => {
    if (user.isValid) {
      firebase.auth().signInWithEmailAndPassword(user.email,user.password)
      .then(response => {
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        setUser(createdUser);
      })
      .catch(err => {
        console.log(err);
        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.error = err.message;
        setUser(createdUser);
      })
    }
    event.preventDefault();
    event.target.reset();
  }

  return (
    <div className="App">
      { user.isSignedIn ? <button onClick={signOut}>SignOut</button> : <button onClick={signIn}>SignIn</button>}
      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}</p>
          <p>{user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }
      
      <h1>Our own authentication</h1>
      <label htmlFor="switchForm">
      <input type="checkbox" name="switchForm" onChange={switchForm} id="switchForm"/> Returning User
      </label>

      
      <form style={{display:user.existingUser ? 'block' : 'none'}} onSubmit={signInUser}>
        <input type="text" onBlur={handleChange} name="email" placeholder="Your email" required/><br/>
        <input type="password" onBlur={handleChange} name="password" placeholder="Your Password" required/><br/>
        <input type="submit" value="Sign In"/>
      </form>

      <form style={{display:user.existingUser ? 'none' : 'block'}} onSubmit={createAccount}>
        <input type="text" onBlur={handleChange} name="name" placeholder="Your name"/><br/>
        <input type="text" onBlur={handleChange} name="email" placeholder="Your email" required/><br/>
        <input type="password" onBlur={handleChange} name="password" placeholder="Your Password" required/><br/>
        <input type="submit" value="Create Account"/>
      </form>
      {
        user.error && <p>{user.error}</p>
      }
    </div>
  );
}

export default App;
