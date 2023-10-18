import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import "./userForm.css"


export default function Login() {

    const {attemptLogin} = useOutletContext()

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
                
                <label htmlFor="username">Username</label>

                <input id="username"
                type="text"
                onChange={handleChangeUsername}
                value={username}
                />

                <label htmlFor="password">Password</label>
                <input id="password"
                type="text"
                onChange={handleChangePassword}
                value={password}
                />

                <input type="submit"
                value="LOGIN"
                />

                <span>No account? <a href="/signup">SIGN UP</a></span>

            </form>
        </div>
    )
}