import { useState, useEffect } from 'react';
import { getGames } from '../services/api';

export default function GamesPage() {
    const [games, setGames] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedGame, setSelectedGame] = useState(null);

    const fetchGames = async () => {
        setLoading(true);
        try {
            const data = await getGames({ page, search, limit: 15 });
            setGames(data.games || []);
            setTotal(data.total || 0);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            console.error('Fetch games error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchGames(); }, [page, search]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setSearch(searchInput);
    };

    const formatDate = (d) => {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getResultBadge = (game) => {
        if (!game.winner_id) return <span className="result-draw">½-½</span>;
        if (game.winner_id === game.player_white) return <span className="result-white">1-0</span>;
        return <span className="result-black">0-1</span>;
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>Game History</h1>
                <span className="badge">{total} games</span>
            </div>

            <form className="search-bar" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search by player username..."
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
                                    <th>White</th>
                                    <th>Black</th>
                                    <th>Result</th>
                                    <th>Time Control</th>
                                    <th>Date</th>
                                    <th>PGN</th>
                                </tr>
                            </thead>
                            <tbody>
                                {games.map((game) => (
                                    <tr key={game.id}>
                                        <td>
                                            <div className="player-cell white-player">
                                                <span className="piece-icon">♔</span>
                                                {game.white_username || game.player_white?.slice(0, 8) || '—'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="player-cell black-player">
                                                <span className="piece-icon">♚</span>
                                                {game.black_username || game.player_black?.slice(0, 8) || '—'}
                                            </div>
                                        </td>
                                        <td>{getResultBadge(game)}</td>
                                        <td>{game.time_control || '—'}</td>
                                        <td>{formatDate(game.created_at)}</td>
                                        <td>
                                            <button
                                                className="btn-sm btn-outline"
                                                onClick={() => setSelectedGame(selectedGame?.id === game.id ? null : game)}
                                            >
                                                {selectedGame?.id === game.id ? 'Hide' : 'View'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {games.length === 0 && (
                                    <tr><td colSpan="6" className="empty-row">No games found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {selectedGame && (
                        <div className="pgn-viewer">
                            <h3>PGN — Game {selectedGame.id.slice(0, 8)}</h3>
                            <pre>{selectedGame.pgn_data || 'No PGN recorded for this game.'}</pre>
                        </div>
                    )}

                    <div className="pagination">
                        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="btn-secondary">← Prev</button>
                        <span>Page {page} of {totalPages}</span>
                        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="btn-secondary">Next →</button>
                    </div>
                </>
            )}
        </div>
    );
}
