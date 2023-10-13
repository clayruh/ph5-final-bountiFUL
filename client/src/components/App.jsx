import React, { useEffect, useState } from "react";

// COMPONENTS //
import UserPanel from './User'
import MapBox from "./MapBox";


const POST_HEADERS = {
  'Content-Type': 'application/json',
  'Accepts': 'application/json'
}

const URL = "/api/v1"

export default function App() {

  // STATE //
  const [currentUser, setCurrentUser] = useState(null)
  const [latlng, setLatLng] = useState(null)

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

  // GEOLOCATION //
  const successCallback = position => {
    console.log(position)
    const lng = position.coords.longitude
    const lat = position.coords.latitude
    const latlng = {lat,lng}
    setLatLng(latlng)
  }

  const errorCallback = (error) => {
    console.log(error)
  }

  function getCurrentPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback)
    } else {
      alert('Sorry your browser does not support geolocation, please add in an address')
    }
  }

  // SEND PHOTO TO PLANT ID API //
  function handleImageUpload(e) {
    e.preventDefault()

    if (e.target) {
      const formData = new FormData(e.target)
      console.log(e.target)
      console.log([...formData.entries()].forEach(i => console.log(i)))

      if (latlng) {
        formData.append("lat", latlng.lat)
        formData.append("lng", latlng.lng)
      }

      async function upload_image_to_database () {
        await fetch(URL + '/process-image', {
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
          <label htmlFor="comment">comment</label>
          <input type="text" name="comment"/>
        <br/>
          <label htmlFor="upload-image">upload image</label>
          <input 
            id="upload-image" 
            name="upload-image"
            type="file" 
            accept="image/*, .heic" 
            capture="camera"
          />
        <br/>
          <input 
            type="checkbox" 
            id="current-position" 
            name="current-position" 
            onClick={getCurrentPosition} />
          <label htmlFor="current-position">use my current location</label>
        <br/>
          <input type="submit" value="add a pin"/>
      </form>

      <MapBox />
      
    </div>
  )
}
