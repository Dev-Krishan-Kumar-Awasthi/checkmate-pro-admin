import { useState, useEffect } from 'react';
import { getUsers, banUser } from '../services/api';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getUsers({ page, search, limit: 15 });
            setUsers(data.users || []);
            setTotal(data.total || 0);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            console.error('Fetch users error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, [page, search]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setSearch(searchInput);
    };

    const handleBan = async (userId, currentBan) => {
        const reason = currentBan ? null : prompt('Ban reason:');
        if (!currentBan && !reason) return;
        setActionLoading(userId);
        try {
            await banUser(userId, !currentBan, reason);
            fetchUsers();
        } catch (err) {
            alert('Failed: ' + err.message);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>User Management</h1>
                <span className="badge">{total} users</span>
            </div>

            <form className="search-bar" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search by username..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <button type="submit" className="btn-secondary">Search</button>
            </form>

            {loading ? (
                <div className="page-loading"><span className="spinner-lg"></span></div>
            ) : (
                <>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Mobile</th>
                                    <th>Rapid</th>
                                    <th>Blitz</th>
                                    <th>Bullet</th>
                                    <th>Country</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className={user.is_banned ? 'row-banned' : ''}>
                                        <td>
                                            <div className="user-cell">
                                                <div className="avatar-sm">{user.username?.[0]?.toUpperCase() || '?'}</div>
                                                <span>{user.username}</span>
                                            </div>
                                        </td>
                                        <td>{user.email || '—'}</td>
                                        <td>{user.mobile_number || '—'}</td>
                                        <td>{user.rapid_rating || 800}</td>
                                        <td>{user.blitz_rating || 800}</td>
                                        <td>{user.bullet_rating || 800}</td>
                                        <td>{user.country || '—'}</td>
                                        <td>
                                            <span className={`role-badge ${user.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                                                {user.role || 'user'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-dot ${user.is_banned ? 'banned' : 'active'}`}>
                                                {user.is_banned ? '🚫 Banned' : '✅ Active'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className={`btn-sm ${user.is_banned ? 'btn-success' : 'btn-danger'}`}
                                                onClick={() => handleBan(user.id, user.is_banned)}
                                                disabled={actionLoading === user.id || user.role === 'admin'}
                                            >
                                                {actionLoading === user.id ? '...' : user.is_banned ? 'Unban' : 'Ban'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr><td colSpan="8" className="empty-row">No users found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage(p => p - 1)}
                            className="btn-secondary"
                        >← Prev</button>
                        <span>Page {page} of {totalPages}</span>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="btn-secondary"
                        >Next →</button>
                    </div>
                </>
            )}
        </div>
    );
}
