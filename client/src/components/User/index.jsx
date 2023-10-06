import Signup from './Signup'
import Login from './Login'

export default function UserPanel() {

    if (!currentUser) {
        return (
            <div className="flex-row">
                <Signup/>
    
                <Login/>
            </div>
        )
    } else {
        return (
            <h2>Welcome user</h2>
        )
    }
}