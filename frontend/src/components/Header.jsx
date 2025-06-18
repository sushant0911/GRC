import React from 'react';

const Header = () => {
    return (
        <header className="header fade-in">
            <h2 className="header-title">Compliance Dashboard</h2>
            <div className="header-actions">
                <button className="btn btn-secondary" aria-label="Export Report">
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </svg>
                    Export Report
                </button>
                <button className="btn btn-primary" aria-label="Start New Audit">
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                    New Audit
                </button>
            </div>
        </header>
    );
};

export default Header;
