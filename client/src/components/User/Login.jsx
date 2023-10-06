import { useState } from 'react'

export default function Login() {

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

            <input type="text"
            onChange={handleChangeUsername}
            value={username}
            placeholder='username'
            />

            <input type="text"
            onChange={handleChangePassword}
            value={password}
            placeholder='password'
            />

            <input type="submit"
            value="Log in"
            />

        </form>
    )
}