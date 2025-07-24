import { useState, useEffect, useRef } from "react";
import '../styles/header.css';

function Header({ profiles, profile, setPage, currentIndex, setCurrentIndex }) {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {

            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }


        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);


            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [dropdownOpen]);

    return (
        <header className="header">

            <a href="#/" onClick={(e) => {e.preventDefault(); setPage('home'); }} className="logo-link" aria-label="Go to home page">
                <img src="/logo.jpg" className="logo" alt="cat lovers logo" />
            </a>

            <select
                className="profile-switcher"
                value={currentIndex}
                onChange={(e) => setCurrentIndex(Number(e.target.value))}
                aria-label="Switch profile"
            >
                  {profiles.map((p, i) => (
                    <option key={i} value={i}>
                      {p.username}
                    </option>
                  ))}

            </select>

            <div className="profile-area" ref={dropdownRef}>
                <button

                    className="profile-button"
                    aria-expanded={dropdownOpen}
                    aria-controls="profile-dropdown"
                    onClick={() => setDropdownOpen((open) => !open)}
                    aria-label="Open profile menu"
                >
                    <img src={`/${profile.pic}`} alt={`${profile.username}'s profile picture`}  className="profile-img" />

                </button>

                {dropdownOpen && (
                    <div id="profile-dropdown" className="dropdown" role="menu">
                        <div
                            className={profile.dogFree ? 'dropdown-username fabulous': 'dropdown-username'}>
                            {profile.username}
                        </div>

                        <button
                            className="dropdown-link"
                            aria-label="Go to profile settings"
                            onClick={(e) => {
                                    e.preventDefault();
                                    setPage('profile');
                                    setDropdownOpen(false);
                                }}
                            role="menuitem"
                        >
                            Profile Settings
                        </button>

                    </div>

                )}

            </div>

        </header>
    )

}
export default Header;