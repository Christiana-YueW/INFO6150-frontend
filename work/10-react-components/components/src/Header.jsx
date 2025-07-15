import Button from './Button';
import './HeaderFooter.css';

function Header({ setPage }) {
    return (
        <header className="header">
            <div className="page-content">

                <h1> Purely Lemon </h1>

                <nav>
                    <button visual="link" onClick={() => setPage('Text')}>Text</button>
                    <button visual="link" onClick={() => setPage('CardsPage')}>Cards</button>
                    <button visual="link" onClick={() => setPage('PanelsPage')}>Panels</button>
                </nav>

            </div>

        </header>
    )
}

export default Header;