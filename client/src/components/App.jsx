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
  const [optIn, setOptIn] = useState(false)
  const [address, setAddress] = useState('')
  const [minCharTyped, setMinCharTyped] = useState(false)
  const [suggestions, setSuggestions] = useState([])
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
      // should I put something here like the address bar then should be disabled?
    } else {
      setOptIn(false)
      alert('Sorry your browser does not support geolocation, please add in an address')
    }
  }

  // HANDLE ADDRESS INPUT //
  useEffect( () => {
    if (minCharTyped) {
      const geocode = async () => {
        const limit = 5
        const autocomplete = true
        const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?proximity=ip&access_token=${process.env.REACT_APP_MAPBOX_API_KEY}&limit=${limit}&autocomplete=${autocomplete}`

        try {
          const response = await fetch(endpoint)
          if (response.ok) {
            const data = await response.json()
            const locations = data.features.map( (feature) => ({
              name: feature.place_name,
              longitude: feature.center[0],
              latitude: feature.center[1]
            }) )

            // soooo when the option is clicked on, that's the long + lat I want
            // locations.forEach(location => {
            //   console.log("name", location.name)
            //   console.log("longitude", location.longitude)
            //   console.log("latitude", location.latitude)
            // })
            setSuggestions(locations)
          }
        } catch (error) {
          console.log(error)
        }
      }
      geocode()
    }
  }, [address, minCharTyped] )

  function handleSuggestionClick(selectedLocation) {
    setSelectedSuggestion(selectedLocation)
    console.log("latitude", selectedLocation.latitude)
    console.log("longitude", selectedLocation.longitude)
    setAddress(selectedLocation.name)
    setSuggestions([])
  }

  // SEND PHOTO TO PLANT ID API //
  function handleImageUpload(e) {
    e.preventDefault()

    if (e.target) {
      const formData = new FormData(e.target)
      console.log(e.target)
      console.log([...formData.entries()].forEach(i => console.log(i)))

      if (optIn == true) {
        formData.append("lat", latlng.lat)
        formData.append("lng", latlng.lng)
        // somewhere here, want to say if the user opts in for c
      } else if (optIn == false) {
        formData.append("lat", selectedSuggestion.latitude)
        formData.append("lng", selectedSuggestion.longitude)
        console.log(selectedSuggestion.latitude, selectedSuggestion.longitude)
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
            checked={optIn}
            onClick={getCurrentPosition} />
          <label htmlFor="current-position">use my current location</label>
        <br/>
          <label htmlFor="address">address</label>
          <input 
            id="address" 
            name="address" 
            type="text"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value)
              setMinCharTyped(e.target.value.length >= 4)}}/>
        <br/>
          <ul>
            {suggestions.map( (location, index) => (
              <li key={index} onClick={() => handleSuggestionClick(location)}>
                {location.name}
              </li>
            ) )}
          </ul>
          <label htmlFor="comment">comment</label>
          <input type="text" name="comment"/>
        <br/>
          <input type="submit" value="add a pin"/>
      </form>

      <MapBox />
      
    </div>
  )
}
