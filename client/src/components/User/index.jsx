import Signup from './Signup'
import Login from './Login'
import { useOutletContext } from 'react-router-dom'

import MyPins from '../MyPins'

export default function UserPanel() {

    const {currentUser, attemptLogin, attemptSignup, logout} = useOutletContext()

    if (!currentUser) {
        return (
            <div className="flex-row">
                <Signup attemptSignup={attemptSignup} />
            </div>
        )
    } else {
        <Login attemptLogin={attemptLogin} />
    } if (currentUser) {
        return (
            <>
                <h2>Hi {currentUser.fname} {currentUser.lname}</h2>
                <p>username: {currentUser.username}</p>
                <p>address: {currentUser.address}</p>

                <button onClick={logout}>Logout</button>
                <MyPins/>
            </>
        )
    }
}