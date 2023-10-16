import React, { useEffect, useState } from "react";
import { Outlet } from 'react-router-dom'

// COMPONENTS //
import Header from './Header'
import UserPanel from './User'
import AddPinForm from './AddPinForm'
import MapBox from "./MapBox";

const POST_HEADERS = {
  'Content-Type': 'application/json',
  'Accepts': 'application/json'
}

const URL = "/api/v1"

export default function App() {

  // STATE //
  const [currentUser, setCurrentUser] = useState(null)
  const [pins, setPins] = useState([])

  const [latlng, setLatLng] = useState(null)
  const [optIn, setOptIn] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState(null)

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

  // USER'S CURRENT GEOLOCATION //
  const successCallback = position => {
    console.log(position)
    const lng = position.coords.longitude
    const lat = position.coords.latitude
    const latlng = {lat,lng}
    setLatLng(latlng)
  }

  const errorCallback = (error) => {
    setOptIn(false)
    alert('Unable to retrieve your location. Either turn on location services or add in an address')
  }

  function getCurrentPosition() {
    if (navigator.geolocation) {
      setOptIn(true)
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback)
    } else {
      setOptIn(false)
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
      if (currentUser !== null) {
        if (optIn === true) {
          formData.append("lat", latlng.lat)
          formData.append("lng", latlng.lng)
        } else if (optIn === false) {
          formData.append("lat", selectedSuggestion.latitude)
          formData.append("lng", selectedSuggestion.longitude)
        }
  
        function addPin(newPin) {
          setPins(prevPins => [...prevPins, newPin])
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
              res.json().then(newPin => addPin(newPin))
              //  this is where I want to update pin state and add the new one 
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
      } else {
        alert("Please log in or sign up to add a pin")
      }

    }
  }
  
  return (

    <div>
      <Header/>
      <Outlet/>

      {/* <UserPanel
        currentUser={currentUser}
        attemptLogin={attemptLogin}
        attemptSignup={attemptSignup}
        logout={logout}
      /> */}

      <br/>
      <hr></hr>
      <br/>

      <AddPinForm
        handleImageUpload={handleImageUpload}
        optIn={optIn}
        getCurrentPosition={getCurrentPosition}
        setSelectedSuggestion={setSelectedSuggestion}
      />

      <MapBox pins={pins} setPins={setPins}/>
      
    </div>
  )
}