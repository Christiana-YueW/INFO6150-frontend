import Button from './Button';

function Header({ setPage }) {
    return (
        <header className="header">

            <h1> Purely Lemon </h1>

            <nav>
                <button visual="link" onClick={() => setPage('Text')}>Text</button>
                <button visual="link" onClick={() => setPage('Cards')}>Cards</button>
                <button visual="link" onClick={() => setPage('Panels')}>Panels</button>
            </nav>

        </header>
    )
}

export default Header;