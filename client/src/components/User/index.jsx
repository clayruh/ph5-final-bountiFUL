import Signup from './Signup'
import Login from './Login'

export default function UserPanel({ currentUser, attemptLogin, attemptSignup, logout }) {

    if (!currentUser) {
        return (
            <div className="flex-row">
                <Signup attemptSignup={attemptSignup} />
    
                <Login attemptLogin={attemptLogin} />
            </div>
        )
    } else {
        return (
            <h2>Welcome {currentUser.fname} {currentUser.lname}</h2>
        )
    }
}