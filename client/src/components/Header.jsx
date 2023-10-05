import { Link } from 'react-router-dom';

export default function Header() {


    return (
        <header className ='main-header'>
            <h1>Wild Harvest</h1>
            <nav className='nav-bar'>
                <Link className="link" to='/'>Home</Link>
                <Link className="link" to='/'>Take a Picture</Link>
            </nav>

        </header>

    )
}