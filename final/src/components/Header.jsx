import { useState, useRef } from "react";
import '../styles/header.css';

function Header({ currentPage, onNavigate, userProfile }) {

    const pages = [

        {key: 'home', label: 'Home'},
        {key: 'browse', label: 'Browse'},
        {key: 'add', label: 'Add'},
        {key: 'ask', label: 'Ask'},
        {key: 'settings', label: 'Settings'},

    ];

    return (
        <header className="site-header" role="banner">
            <div className="header-top">

                <button
                    type="button"
                    className="logo-button clickable"
                    onClick={() => onNavigate('home')}
                    aria-label="Go to homepage"
                >
                    <img src="/weblogo.jpg" alt="Find My Stuff logo" className="header-logo" />
                </button>

                <h1 className="header-title"> Find My Stuff </h1>
            </div>

            <div className="header-bottom">

                <nav className="site-header__nav" aria-label="Primary navigation">
                    <ul className="nav-list">
                        {pages.map(({key, label}) => (
                            <li key={key} className="nav-list__item">
                                <button
                                    className={`nav-list__link${currentPage === key ? ' nav-list__link--active' : ''}`}
                                    onClick={() => onNavigate(key)}
                                    aria-current={currentPage === key ? 'page' : undefined}
                                >
                                    {label}
                                </button>
                            </li>

                        ))}
                    </ul>
                </nav>

                <button
                    type="button"
                    className="profile-display clickable"
                    onClick={() => onNavigate('settings')}
                    aria-label="Go to settings page"
                >

                    <img
                        src={userProfile.avatarUrl || '/default-avatar.png'}
                        alt={`${userProfile.name} avatar`}
                        className="profile-avatar"
                    />
                    <span className="profile-name"> {userProfile.name} </span>

                </button>
            </div>
        </header>
    );
}



export default  Header;