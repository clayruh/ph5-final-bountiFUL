import { useState } from 'react'

export default function Login({ attemptLogin }) {

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
        <form className='user-form' onSubmit={handleSubmit}>

            <h2>Log In</h2>

            <label htmlFor="username">username</label>
            <input id="username"
            type="text"
            onChange={handleChangeUsername}
            value={username}
            placeholder='username'
            />

            <label htmlFor="password">password</label>
            <input id="password"
            type="text"
            onChange={handleChangePassword}
            value={password}
            placeholder='password'
            />

            <input type="submit"
            value="Log in"
            />

            <span>No account?<strong> Sign Up</strong></span>

        </form>
    )
}