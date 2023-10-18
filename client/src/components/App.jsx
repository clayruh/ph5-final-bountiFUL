import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from 'react-router-dom'

// COMPONENTS //
import Header from './Header'

const POST_HEADERS = {
  'Content-Type': 'application/json',
  'Accepts': 'application/json'
}

const URL = "/api/v1"

export default function App() {

  const navigate = useNavigate()

  // STATE //
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

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
      // checking current user + loading state
      setLoading(false)
      if (res.ok) {
        res.json()
        .then( data => {
          setCurrentUser(data) 
        })
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
      navigate('/map')
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
  
  return (

    <div>
      <Header/>
      {
        // checking loading state
        (loading)? <p>Loading...</p> : 
        <Outlet context={ {currentUser, attemptLogin, attemptSignup, logout} }/>
      }

      {/* <UserPanel
        currentUser={currentUser}
        attemptLogin={attemptLogin}
        attemptSignup={attemptSignup}
        logout={logout}
      /> */}
      
    </div>
  )
}