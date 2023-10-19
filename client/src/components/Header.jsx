import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className='main-header'>
            <a href="/"><h1>🌿 bountiFUL 🌿</h1></a>
            <nav className='nav-bar'>
                <Link className="link" to='/map'>Map</Link>
                <Link className="link" to='/add-a-pin'>Add A Pin</Link>
                <Link className="link" to='/account'>Account Settings</Link>
            </nav>
        </header>
    )
}