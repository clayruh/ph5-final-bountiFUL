import React, { useEffect, useState } from "react";
import UserPanel from './User'
import GoogleMaps from "./GoogleMaps";

const POST_HEADERS = {
  'Content-Type': 'application/json',
  'Accepts': 'application/json'
}

const URL = "/api/v1"

const plantIdKey = process.env.PLANT_API_KEY

export default function App() {

  // STATE //
  const [currentUser, setCurrentUser] = useState(null)

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
    // console.log(e.target.files)
    // alert(e.target.files)
    // const imageFile = e.target
    // const formData = new FormData(e.target)
    // console.log(imageFile)
    // const formData = new FormData(e.target)
    // console.log("yeeeee", formData)
    if (e.target) {
      // const formData = new FormData()
      // // alert(formData)
      // formData.append('image', imageFile)
      // alert(formData)
      // console.log(formData)
      // console.log("\nthis is my image: ")
      // console.log(imageFile)
      const formData = new FormData(e.target)
      console.log(formData)
      
      // for(let [name, value] of formData) {
      //   alert(`${name} = ${value}`); // key1 = value1, then key2 = value2
      // }

      const upload_image_to_database = async () => {
        await fetch("http://localhost:5555" + URL + '/process-image', {
          method: 'POST',
          // possibly changing the format of body or headers
          headers: {
            'Content-Type': 'multipart/form-data',
            // 'Accepts': 'image/jpeg'
          },
          body: formData,
        })
        .then(res => {
          if (res.ok) {
            res.json().then(data => console.log(data))
            console.log("ALLERRTTTTT:")
            console.log(res.ok)
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

      <form encType="multipart/form-data" onSubmit={handleImageUpload}>
      <input 
        id="upload-image" 
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
