import Signup from './Signup'
import Login from './Login'

export default function UserPanel({ currentUser, attemptLogin, attemptSignup, logout }) {

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