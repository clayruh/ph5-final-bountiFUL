import Signup from './Signup'
import Login from './Login'
import { useOutletContext } from 'react-router-dom'

export default function UserPanel() {

    const [currentUser, attemptLogin, attemptSignup, logout] = useOutletContext()
    console.log(currentUser, attemptLogin, attemptSignup, logout)
    console.log("is this working?")

    // change to show the <Signup/> first and if they have an account, show <Login/>
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
            <button onClick={logout}>Logout</button>
            </>
        )
    }
}