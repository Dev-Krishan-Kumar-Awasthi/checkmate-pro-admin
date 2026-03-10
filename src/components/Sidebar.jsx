import { NavLink } from 'react-router-dom';
import { logout } from '../services/api';

export default function Sidebar() {
    const navItems = [
        { path: '/', icon: '📊', label: 'Dashboard', end: true },
        { path: '/users', icon: '👥', label: 'Users' },
        { path: '/games', icon: '♟️', label: 'Games' },
        { path: '/tournaments', icon: '🏆', label: 'Tournaments' },
        { path: '/puzzles', icon: '🧩', label: 'Puzzles' },
        { path: '/reports', icon: '⚠️', label: 'Reports' },
        { path: '/server', icon: '🖥️', label: 'Server' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <span className="brand-icon">♛</span>
                <div>
                    <h2>GX Admin</h2>
                    <span className="brand-sub">Control Panel</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.end}
                        className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button className="btn-logout" onClick={logout}>
                    🚪 Logout
                </button>
            </div>
        </aside>
    );
}
