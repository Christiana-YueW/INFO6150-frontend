import { useState, useRef, useEffect } from "react";
import '../styles/header.css';

function Header({ currentPage, onNavigate, userProfile }) {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const pages = [

        {key: 'home', label: 'Home'},
        {key: 'browse', label: 'Browse'},
        {key: 'add', label: 'Add'},
        {key: 'ask', label: 'Ask'},
        {key: 'settings', label: 'Settings'},

    ];

    useEffect(() => {
        function handleClickOutside(event) {
            if (isMenuOpen &&
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    useEffect(() => {
        function handleEscape(event) {
            if (event.key === 'Escape' && isMenuOpen) {
                setIsMenuOpen(false);
                buttonRef.current?.focus();
            }
        }

        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isMenuOpen]);

     const handleNavClick = (page) => {
        onNavigate(page);
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };



    return (
        <header className="site-header" role="banner">
            <div className="header-top">

                <button

                    className="logo-button clickable"
                    onClick={() => onNavigate('home')}
                    aria-label="Go to homepage"
                >
                    <img src="/weblogo.jpg" alt="Find My Stuff logo" className="header-logo" />
                </button>

                <h1 className="header-title" aria-label="Site title"> Find My Stuff </h1>
            </div>

            <div className="header-bottom">
                <button
                    ref={buttonRef}
                    className="mobile-menu-button"
                    onClick={toggleMenu}
                    aria-expanded={isMenuOpen}
                    aria-controls="navigation-menu"
                    aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                >
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>

                </button>


                <nav className="site-header__nav" aria-label="Primary navigation">
                    <ul
                        ref={menuRef}
                        id="navigation-menu"
                        className={`nav-list ${isMenuOpen ? 'nav-list--open' : ''}`}
                    >
                        {pages.map(({key, label}) => (
                            <li key={key} className="nav-list__item">
                                <button

                                    className={`nav-list__link${currentPage === key ? ' nav-list__link--active' : ''}`}
                                    onClick={() => handleNavClick(key)}
                                    aria-current={currentPage === key ? 'page' : undefined}
                                >
                                    {label}
                                </button>
                            </li>

                        ))}
                    </ul>
                </nav>

                <button

                    className="profile-display clickable"
                    onClick={() => onNavigate('settings')}
                    aria-label="Go to settings page"
                >

                    <img
                        src={userProfile.avatarUrl || '/default-avatar.png'}
                        alt=""
                        className="profile-avatar"
                    />
                    <span className="profile-name" aria-hidden="true"> {userProfile.name} </span>

                </button>
            </div>
        </header>
    );
}



export default  Header;