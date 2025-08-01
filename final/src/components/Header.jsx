import { useState, useRef } from "react";
import '../styles/header.css';

function Header({ currentPage, onNavigate, userProfile }) {

    const pages = [

        {key: 'home', label: 'Home'},
        {key: 'browse', label: 'Browse'},
        {key: 'add', label: 'Add'},
        {key: 'settings', label: 'Settings'},
        {key: 'ask', label: 'Ask'},

    ];

    return (
        <header className="site-header">
            <div className='header-top'>
                <img
                    src="/weblogo.jpg"
                    alt="find my stuff website logo"
                    className="header-logo clickable"
                    onClick={() => onNavigate('home')}
                />

                <h1 className="header-title">
                    Find My Stuff
                </h1>

                <div
                    className="profile-display clickable"
                    onClick={() => onNavigate('settings')}

                >
                    <img
                        src={userProfile.avatarUrl}
                        alt={`${userProfile.name} avatar`}
                        className="profile-avatar"
                    />
                    <span className="profile-name">{userProfile.name}</span>

                </div>
            </div>

            <nav className="header-nav" aria-label="Main navigation">
                <ul className="nav-list">
                    {pages.map(p => (
                        <li key={p.key} className="nav-list__item">
                            <button
                                className={`nav-list__link ${
                                    currentPage === p.key ? 'nav-list__link--active' : ''
                                }`}
                                onClick={() => onNavigate(p.key)}
                            >
                                {p.label}
                            </button>
                        </li>

                    ))}
                </ul>
            </nav>

        </header>
    );
}



export default  Header;