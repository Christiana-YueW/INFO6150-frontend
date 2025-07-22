import { useState} from "react";
import '../styles/header.css';

function Header({ profile, setPage, currentIndex, setCurrentIndex }) {

    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <header className="header">

            <a href="#/" onClick={(e) => {e.preventDefault(); setPage('home'); }} className="logo-link">
                <img src="/logo.jpg" className="logo" alt="logo" />
            </a>

            <select
                className="profile-switcher"
                value={currentIndex}
                onChange={(e) => setCurrentIndex(Number(e.target.value))}
                aria-label="Swtich profile"
            >
                <option value={0}>Mimi</option>
                <option value={1}>Lala</option>
                <option value={2}>Didi</option>

            </select>

            <div className="profile-area">
                <button

                    className="profile-button"
                    aria-expanded={dropdownOpen}
                    onClick={() => setDropdownOpen((open) => !open)}
                >
                    <img src={`/${profile.pic}`} alt="profile"  className="profile-img" />

                </button>

                {dropdownOpen && (
                    <div className="dropdown" role="menu">
                        <div className={profile.dogFree ? 'dropdown-username fabulous': 'dropdown-username'}>
                            {profile.username}
                        </div>

                        <button
                            className="dropdown-link"
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