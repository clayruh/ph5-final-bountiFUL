import React, { useEffect, useState } from "react";
import UserPanel from './User'

const POST_HEADERS = {
  'Content-Type': 'application/json',
  'Accepts': 'application/json'
}

const URL = "/api/v1"

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
  function identifyPlant() {
    fetch('	https://plant.id/api/v3')
    .then(res => res.json())
    .then(data => console.log(data))
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
      
      <input type="file" accept="image/*" capture="camera"/>
      
    </div>
  )
}
