import { Link } from 'react-router-dom';

export default function Header() {


    return (
        <header className='main-header'>
            <h1>🌿 bountiFUL 🌿</h1>
            <nav className='nav-bar'>
                <Link className="link" to='/'>Map</Link>
                <Link className="link" to='/add-a-pin'>Add A Pin</Link>
                <Link className="link" to='/account'>Account Settings</Link>
            </nav>
        </header>
    )
}