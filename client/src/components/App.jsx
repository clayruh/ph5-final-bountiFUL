import React, { useEffect, useState } from "react";
import UserPanel from './User'

const POST_HEADERS = {
  'Content-Type': 'application/json',
  'Accepts': 'application/json'
}

const URL = "/"

export default function App() {

  // STATE //
  const [currentUser, setCurrentUser] = useState(null)

  // USE EFFECT //
  useEffect( () => {
    async function checkSession() {
      const res = await fetch(URL + '/check_session')
      if (res.ok) {
        const data = await res.json()
        setCurrentUser(data)
      }
    }
    checkSession()
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
      alert('Invalid log in')
    }
  }

  function logout() {
    setCurrentUser(null)
    fetch(URL + '/logout', {
      method: 'DELETE'
    })
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
      
    </div>
  )
}
