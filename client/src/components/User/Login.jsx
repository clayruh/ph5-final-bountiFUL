import { useState } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import "./userForm.css"


export default function Login() {

    const [currentUser, attemptLogin, attemptSignup, logout] = useOutletContext()
    console.log(currentUser)

    // STATE //
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleChangeUsername = e => setUsername(e.target.value)
    const handleChangePassword = e => setPassword(e.target.value)

    // HANDLERS //
    function handleSubmit(e) {
        e.preventDefault()
        attemptLogin({username, password})
    }
    
    return (
        <div className='form-container'>

            <form className='user-form' onSubmit={handleSubmit}>

                <h2>Log In</h2>

                <input id="username"
                type="text"
                onChange={handleChangeUsername}
                value={username}
                placeholder='username'
                />

                <input id="password"
                type="text"
                onChange={handleChangePassword}
                value={password}
                placeholder='password'
                />

                <input type="submit"
                value="Log in"
                />

                <span>No account? <a href="/signup">Sign Up</a></span>

            </form>
        </div>
    )
}