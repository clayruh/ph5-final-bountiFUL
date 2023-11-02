import Signup from './Signup'
import Login from './Login'
import { useOutletContext } from 'react-router-dom'

import MyPinsList from '../MyPinsList'
import {useState} from 'react'

export default function UserPanel() {

    const {currentUser, attemptLogin, attemptSignup, logout} = useOutletContext()
    // const [editForm, setEditForm] = useState(false)
    

    // function handleEdit() {
    //     setEditForm(!editForm)
    // }

    if (!currentUser) {
        return (
            <div className="flex-row">
                <Login attemptLogin={attemptLogin} />
            </div>
        )
    } else {
        <Signup attemptSignup={attemptSignup} />
    } if (currentUser) {
        return (
            <div className="account-page">
                <div className="account-details">
                    <h2>Account</h2>
                    <p>full name: {currentUser.fname} {currentUser.lname}</p>
                    <p>username: {currentUser.username}</p>
                    <p>password: ********</p>
                    <p>address: {currentUser.address}</p>

                    {/* <button onClick={handleEdit}>Edit Settings</button>
                    <br></br> */}
                    <button onClick={logout}>Logout</button>
                </div>
                <MyPinsList/>
            </div>
        )
    }
}