import React, { useEffect, useState } from "react";
import UserPanel from './User'
import GoogleMaps from "./GoogleMaps";

const POST_HEADERS = {
  'Content-Type': 'application/json',
  'Accepts': 'application/json'
}

const URL = "/api/v1"

export default function App() {

  // STATE //
  const [currentUser, setCurrentUser] = useState(null)
  const [plants, setPlants] = useState([])

  // USE EFFECT //
  useEffect( () => {
    // async function checkSession() {
    //   const res = await fetch('/check_session')
    //   if (res.ok) {
    //     const data = await res.json()
    //     setCurrentUser(data)
    //   }
    // }
    // checkSession()
    fetch(URL + '/check_session')
    .then( res => {
      if (res.ok) {
        res.json()
        .then( data => setCurrentUser(data) )
      }
    })
  }, [] )

  // SIGNUP, LOGIN, LOGOUT //
  async function attemptSignup(userInfo) {
    try {
      const res = await fetch(URL + '/users', {
        method: 'POST',
        headers: POST_HEADERS,
        body: JSON.stringify(userInfo)
      })
      if (res.ok) {
        const data = await res.json()
        setCurrentUser(data)
      } else {
        alert('Invalid sign up')
      }
    } catch (error) {
      alert(error)
    }
  }
  
  async function attemptLogin(userInfo) {
    const res = await fetch(URL + '/login', {
      method: 'POST',
      headers: POST_HEADERS,
      body: JSON.stringify(userInfo)
    })
    if (res.ok) {
      const data = await res.json()
      setCurrentUser(data)
    } else {
      alert('Incorrect username or password')
    }
  }
  
  function logout() {
    setCurrentUser(null)
    fetch(URL + '/logout', {
      method: 'DELETE'
    })
  }

  // PLANT ID API //
  function handleImageUpload(e) {
    e.preventDefault()

    if (e.target) {
      // somehow the FormData is able to take in the image and it's an array. Don't need to append???. Kash says maybe it's 'cause it's just one thing, so don't need key:value pairs

      // so if I add in a comment area, then maybe need to be appending with key:value pairs
      const formData = new FormData(e.target)
      console.log(e.target)
      console.log([...formData.entries()].forEach(i => console.log(i)))

      async function upload_image_to_database () {
        await fetch("http://localhost:5555" + URL + '/process-image', {
          method: 'POST',
          // DO NOT set headers for passing `multipart/form-data`.
          // For some reason, passing non-JSON-serialized data 
          // using fetch request to Flask backend breaks when 
          // manually specifying headers for fetch. It shouldn't 
          // do that, but it does. So we'll just leave it alone. 
          body: formData,
        })
        .then(res => {
          if (res.ok) {
            res.json().then(data => console.log(data))
          } else {
            console.log(res)
            alert('Error processing image.')
          }
        })
        .catch(error => {
          console.error('Error:', error)
          alert('An error occurred while processing the image')
        })
      }

      upload_image_to_database()
      
    }
  }
  
  return (

    <div>
      <h1>Wild Harvest</h1>

      <UserPanel
        currentUser={currentUser}
        attemptLogin={attemptLogin}
        attemptSignup={attemptSignup}
        logout={logout}
      />

      <br/>
      <hr></hr>
      <br/>

      <form onSubmit={handleImageUpload}>
        <input type="text" name="comment"/>
        <input 
          id="upload-image" 
          name="upload-image"
          type="file" 
          accept="image/*" 
          capture="camera"
        />
      <input type="submit" value="upload image"/>
      </form>

      <GoogleMaps/>
      
    </div>
  )
}
