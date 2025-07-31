import { useState, useRef } from "react";
import '../styles/header.css';

function Header({ currentPage, onNavigate }) {

    const pages = [

        {key: 'home', label: 'Home'},
        {key: 'browse', label: 'Browse'},
        {key: 'add', label: 'Add'},
        {key: 'settings', label: 'Settings'},
        {key: 'ask', label: 'Ask'},

    ];

    return (
        <header className="site-header">
            <div
                className="site-header_logo"
                role="button"
                tabIndex={0}
                onClick={() => onNavigate('home')}
                onKeyPress={e => e.key === 'Enter' && onNavigate('home')}
            >
                Find My Stuff
            </div>

            <nav className="site-header_nav" aria-label="Main navigation">
                <ul className="nav-list">
                    {pages.map(p => (
                        <li key={p.key} className="nav-list_item">
                            <button
                                className={`nav-list_link ${
                                    currentPage === p.key ? 'nav-list_link--active' : ''
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