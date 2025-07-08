import React from 'react';
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export function Layout() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleAskAIClick = () => {
        if (location.pathname === '/askAI') {
            navigate(0); // Reload current route
        } else {
            navigate('/askAI');
        }
    };

    return (
        <div className="app-layout">
            <header className="app-header">
                <div className="header-content">
                    <div
                        onClick={() => navigate('/')}
                        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    >
                        <img style={{ height: 25, paddingRight: 20 }} src="logo.png" alt="Logo" />
                        <h1>Prove My Point</h1>
                    </div>

                    <nav>
                        {/* Ask AI always available */}
                        <button className="nav-button" onClick={handleAskAIClick}>
                            <i className="fa-solid fa-hexagon-nodes" style={{ color: '#ffffff', marginRight: '0.5rem' }}></i>
                            Ask AI
                        </button>

                        {/* Auth controls */}
                        <SignedIn>
                            <UserButton
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox: {
                                            width: "37px",
                                            height: "37px"
                                        }
                                    }
                                }}
                            />
                        </SignedIn>
                        <SignedOut>
                            <button className="nav-button" onClick={() => navigate('/sign-in')}>
                                <i className="fa-solid fa-user" style={{ color: '#ffffff', marginRight: '0.5rem' }}></i>
                                Sign In
                            </button>
                        </SignedOut>
                    </nav>
                </div>
            </header>

            <main className="app-main">
                {/* No redirect for signed out users */}
                <Outlet />
            </main>
        </div>
    );
}
