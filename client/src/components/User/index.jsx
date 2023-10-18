import Signup from './Signup'
import Login from './Login'
import { useOutletContext } from 'react-router-dom'

import MyPinsList from '../MyPinsList'

export default function UserPanel() {

    const {currentUser, attemptLogin, attemptSignup, logout} = useOutletContext()

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
            <>
                <h2>Hi {currentUser.fname} {currentUser.lname}</h2>
                <p>username: {currentUser.username}</p>
                <p>password: ********</p>
                <p>address: {currentUser.address}</p>

                <button onClick={logout}>Logout</button>
                <MyPinsList/>
            </>
        )
    }
}