import { useState } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'

export default function Signup() {

    const navigate = useNavigate()

    const {attemptSignup} = useOutletContext()

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
        navigate('/account')
    }

    return (
        <div className='form-container'>
            <form className='user-form' onSubmit={handleSubmit}>

                <h2>Sign Up</h2>

                <label htmlFor="fname">First Name</label>
                <input id="fname" 
                type="text"
                onChange={handleChangeFName}
                value={fname}
                />

                <label htmlFor="lname">Last Name</label>
                <input id="lname" 
                type="text"
                onChange={handleChangeLName}
                value={lname}
                />

                <label htmlFor="address">Address</label>
                <input id="address" 
                type="text"
                onChange={handleChangeAddress}
                value={address}
                />

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
                value="SIGN UP"
                />

                <span>Already a user? <a href="/login">LOGIN</a></span>

            </form>
        </div>
    )
}