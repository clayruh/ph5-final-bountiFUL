import {useState} from 'react'

export default function Signup() {

    // STATE //
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    // EVENTS //
    const handleChangeUsername = e => setUsername(e.target.value)
    const handleChangePassword = e => setPassword(e.target.value)

    // HANDLERS //
    function handleSubmit(e) {
        e.preventDefault()
        attemptSignup({username, password})
    }

    return (
        <form className='user-form' onSubmit={handleSubmit}>

            <h2>Sign Up</h2>

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
            value="Sign Up"
            />

        </form>
    )
}