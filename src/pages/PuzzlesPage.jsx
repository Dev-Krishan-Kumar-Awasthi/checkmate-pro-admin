import { useState, useEffect } from 'react';
import { getPuzzles, createPuzzle, deletePuzzle, setDailyPuzzle } from '../services/api';

export default function PuzzlesPage() {
    const [puzzles, setPuzzles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [formData, setFormData] = useState({
        fen: '',
        solution: '',
        rating: 1500,
        themes: '',
        is_daily: false
    });
    const [creating, setCreating] = useState(false);

    const fetchPuzzles = async () => {
        try {
            const data = await getPuzzles();
            setPuzzles(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching puzzles:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPuzzles(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            await createPuzzle({
                ...formData,
                themes: formData.themes.split(',').map(t => t.trim()).filter(Boolean)
            });
            setShowCreate(false);
            setFormData({ fen: '', solution: '', rating: 1500, themes: '', is_daily: false });
            fetchPuzzles();
        } catch (err) {
            alert('Error creating puzzle: ' + err.message);
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this puzzle?')) return;
        try {
            await deletePuzzle(id);
            fetchPuzzles();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    const handleSetDaily = async (id) => {
        try {
            await setDailyPuzzle(id);
            fetchPuzzles();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    const ratingColor = (r) => {
        if (r < 1200) return '#00FFC6';
        if (r < 1600) return '#FFD60A';
        if (r < 2000) return '#FF6B35';
        return '#FF006E';
    };

    if (loading) return <div className="page-loading"><span className="spinner-lg"></span></div>;

    return (
        <div className="page">
            <div className="page-header">
                <h1>Puzzle Management</h1>
                <button className="btn-primary" onClick={() => setShowCreate(!showCreate)}>
                    {showCreate ? '✕ Cancel' : '+ Add Puzzle'}
                </button>
            </div>

            {showCreate && (
                <div className="card" style={{ marginBottom: 24 }}>
                    <h3 style={{ marginBottom: 16 }}>Add New Puzzle</h3>
                    <form onSubmit={handleCreate} className="form-grid">
                        <div className="form-group" style={{ gridColumn: '1/-1' }}>
                            <label>FEN Position</label>
                            <input type="text" required value={formData.fen}
                                onChange={e => setFormData({ ...formData, fen: e.target.value })}
                                placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                                style={{ fontFamily: 'monospace' }} />
                        </div>
                        <div className="form-group" style={{ gridColumn: '1/-1' }}>
                            <label>Solution (comma-separated moves)</label>
                            <input type="text" required value={formData.solution}
                                onChange={e => setFormData({ ...formData, solution: e.target.value })}
                                placeholder="e.g. Qh5, Nf3, Bxf7+"
                                style={{ fontFamily: 'monospace' }} />
                        </div>
                        <div className="form-group">
                            <label>Rating</label>
                            <input type="number" min="400" max="3000" value={formData.rating}
                                onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) })} />
                        </div>
                        <div className="form-group">
                            <label>Themes</label>
                            <input type="text" value={formData.themes}
                                onChange={e => setFormData({ ...formData, themes: e.target.value })}
                                placeholder="fork, pin, mate-in-2" />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <input type="checkbox" checked={formData.is_daily}
                                    onChange={e => setFormData({ ...formData, is_daily: e.target.checked })} />
                                Set as Daily Puzzle
                            </label>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-primary" disabled={creating}>
                                {creating ? 'Adding...' : '🧩 Add Puzzle'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>FEN</th>
                            <th>Rating</th>
                            <th>Themes</th>
                            <th>Daily</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {puzzles.length === 0 ? (
                            <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, opacity: 0.5 }}>No puzzles yet</td></tr>
                        ) : puzzles.map((p, i) => (
                            <tr key={p.id}>
                                <td>{i + 1}</td>
                                <td style={{ fontFamily: 'monospace', fontSize: 12, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {p.fen}
                                </td>
                                <td>
                                    <span style={{ color: ratingColor(p.rating), fontWeight: 'bold' }}>{p.rating}</span>
                                </td>
                                <td>
                                    {(p.themes || []).map(t => (
                                        <span key={t} className="badge badge-outline" style={{ marginRight: 4, fontSize: 11 }}>{t}</span>
                                    ))}
                                </td>
                                <td>
                                    {p.is_daily ? <span className="badge badge-green">✓ Daily</span> :
                                        <button className="btn-sm" onClick={() => handleSetDaily(p.id)}>Set Daily</button>
                                    }
                                </td>
                                <td>
                                    <button className="btn-sm btn-danger" onClick={() => handleDelete(p.id)}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
