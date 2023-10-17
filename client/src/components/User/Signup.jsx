import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'

export default function Signup() {

    const [attemptSignup] = useOutletContext()

    // STATE //
    const [fname, setFName] = useState('')
    const [lname, setLName] = useState('')
    const [address, setAddress] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    // EVENTS //
    const handleChangeFName = e => setFName(e.target.value)
    const handleChangeLName = e => setLName(e.target.value)
    const handleChangeAddress = e => setAddress(e.target.value)
    const handleChangeUsername = e => setUsername(e.target.value)
    const handleChangePassword = e => setPassword(e.target.value)

    // HANDLERS //
    function handleSubmit(e) {
        e.preventDefault()
        attemptSignup({ username, password, fname, lname, address})
    }

    return (
        <form className='user-form' onSubmit={handleSubmit}>

            <h2>Sign Up</h2>

            <input id="fname" 
            type="text"
            onChange={handleChangeFName}
            value={fname}
            placeholder='First Name'
            />

            <input id="lname" 
            type="text"
            onChange={handleChangeLName}
            value={lname}
            placeholder='Last Name'
            />

            <input id="address" 
            type="text"
            onChange={handleChangeAddress}
            value={address}
            placeholder='address'
            />

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
            value="Sign Up"
            />

            <span>Already have an account? <a href="/login"> Login</a></span>

        </form>
    )
}