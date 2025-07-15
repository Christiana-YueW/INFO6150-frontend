import Button from './Button';
import './HeaderFooter.css';

function Header({ setPage }) {
    return (
        <header className="header">
            <div className="page-content">

                <h1> Purely Lemon </h1>

                <nav>
                    <Button visual="link" onClick={() => setPage('Text')}>Text</Button>
                    <Button visual="link" onClick={() => setPage('CardsPage')}>Cards</Button>
                    <Button visual="link" onClick={() => setPage('PanelsPage')}>Panels</Button>
                </nav>

            </div>

        </header>
    )
}

export default Header;