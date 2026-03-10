import { useState, useEffect } from 'react';
import { getTournaments, createTournament, deleteTournament } from '../services/api';

export default function TournamentsPage() {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        format: 'swiss',
        max_players: 16,
        time_control: '10+5',
        start_time: '',
        description: ''
    });
    const [creating, setCreating] = useState(false);

    const fetchTournaments = async () => {
        try {
            const data = await getTournaments();
            setTournaments(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching tournaments:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTournaments(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            await createTournament(formData);
            setShowCreate(false);
            setFormData({ name: '', format: 'swiss', max_players: 16, time_control: '10+5', start_time: '', description: '' });
            fetchTournaments();
        } catch (err) {
            alert('Error creating tournament: ' + err.message);
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this tournament?')) return;
        try {
            await deleteTournament(id);
            fetchTournaments();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    const formatDate = (d) => d ? new Date(d).toLocaleString() : '—';
    const statusBadge = (t) => {
        const now = new Date();
        const start = new Date(t.start_time);
        if (t.status === 'completed') return <span className="badge badge-green">Completed</span>;
        if (t.status === 'active' || (start <= now)) return <span className="badge badge-blue">Active</span>;
        return <span className="badge badge-yellow">Upcoming</span>;
    };

    if (loading) return <div className="page-loading"><span className="spinner-lg"></span></div>;

    return (
        <div className="page">
            <div className="page-header">
                <h1>Tournaments</h1>
                <button className="btn-primary" onClick={() => setShowCreate(!showCreate)}>
                    {showCreate ? '✕ Cancel' : '+ Create Tournament'}
                </button>
            </div>

            {showCreate && (
                <div className="card" style={{ marginBottom: 24 }}>
                    <h3 style={{ marginBottom: 16 }}>Create New Tournament</h3>
                    <form onSubmit={handleCreate} className="form-grid">
                        <div className="form-group">
                            <label>Tournament Name</label>
                            <input type="text" required value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. GX Championship Series" />
                        </div>
                        <div className="form-group">
                            <label>Format</label>
                            <select value={formData.format}
                                onChange={e => setFormData({ ...formData, format: e.target.value })}>
                                <option value="swiss">Swiss</option>
                                <option value="knockout">Knockout</option>
                                <option value="round_robin">Round Robin</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Max Players</label>
                            <input type="number" min="4" max="256" value={formData.max_players}
                                onChange={e => setFormData({ ...formData, max_players: parseInt(e.target.value) })} />
                        </div>
                        <div className="form-group">
                            <label>Time Control</label>
                            <select value={formData.time_control}
                                onChange={e => setFormData({ ...formData, time_control: e.target.value })}>
                                <option value="1+0">Bullet (1+0)</option>
                                <option value="3+0">Blitz (3+0)</option>
                                <option value="3+2">Blitz (3+2)</option>
                                <option value="10+0">Rapid (10+0)</option>
                                <option value="10+5">Rapid (10+5)</option>
                                <option value="15+10">Classical (15+10)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Start Time</label>
                            <input type="datetime-local" required value={formData.start_time}
                                onChange={e => setFormData({ ...formData, start_time: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <input type="text" value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Optional description" />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-primary" disabled={creating}>
                                {creating ? 'Creating...' : '🏆 Create Tournament'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Format</th>
                            <th>Players</th>
                            <th>Time Control</th>
                            <th>Start</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tournaments.length === 0 ? (
                            <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, opacity: 0.5 }}>No tournaments yet</td></tr>
                        ) : tournaments.map(t => (
                            <tr key={t.id}>
                                <td><strong>{t.name}</strong></td>
                                <td style={{ textTransform: 'capitalize' }}>{t.format}</td>
                                <td>{t.current_players || 0}/{t.max_players}</td>
                                <td>{t.time_control}</td>
                                <td>{formatDate(t.start_time)}</td>
                                <td>{statusBadge(t)}</td>
                                <td>
                                    <button className="btn-sm btn-danger" onClick={() => handleDelete(t.id)}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
