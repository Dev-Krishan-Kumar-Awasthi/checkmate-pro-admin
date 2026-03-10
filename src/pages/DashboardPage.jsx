import { useState, useEffect } from 'react';
import { getStats } from '../services/api';

function StatsCard({ icon, label, value, color, subtext }) {
    return (
        <div className="stats-card" style={{ '--accent': color }}>
            <div className="stats-icon">{icon}</div>
            <div className="stats-info">
                <span className="stats-value">{value}</span>
                <span className="stats-label">{label}</span>
                {subtext && <span className="stats-sub">{subtext}</span>}
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const data = await getStats();
            setStats(data);
        } catch (err) {
            console.error('Stats error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 10000); // Refresh every 10s
        return () => clearInterval(interval);
    }, []);

    const formatUptime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    };

    const formatMemory = (bytes) => {
        return (bytes / 1024 / 1024).toFixed(1) + ' MB';
    };

    if (loading) return <div className="page-loading"><span className="spinner-lg"></span></div>;

    return (
        <div className="page">
            <div className="page-header">
                <h1>Dashboard</h1>
                <span className="live-badge">● LIVE</span>
            </div>

            <div className="stats-grid">
                <StatsCard
                    icon="👥"
                    label="Total Users"
                    value={stats?.totalUsers || 0}
                    color="#00FFC6"
                />
                <StatsCard
                    icon="⚔️"
                    label="Total Games"
                    value={stats?.totalGames || 0}
                    color="#7000FF"
                />
                <StatsCard
                    icon="🎮"
                    label="Games Today"
                    value={stats?.gamesToday || 0}
                    color="#FF6B35"
                />
                <StatsCard
                    icon="🔌"
                    label="Live Connections"
                    value={stats?.activeConnections || 0}
                    color="#00B4D8"
                />
                <StatsCard
                    icon="⏱️"
                    label="Queue Size"
                    value={stats?.queueSize || 0}
                    color="#FFD60A"
                />
                <StatsCard
                    icon="🚫"
                    label="Banned Users"
                    value={stats?.bannedUsers || 0}
                    color="#FF006E"
                />
                <StatsCard
                    icon="⚠️"
                    label="Pending Reports"
                    value={stats?.pendingReports || 0}
                    color="#FB5607"
                />
                <StatsCard
                    icon="🖥️"
                    label="Server Uptime"
                    value={stats ? formatUptime(stats.serverUptime) : '—'}
                    color="#8338EC"
                    subtext={stats ? `Memory: ${formatMemory(stats.memoryUsage)}` : ''}
                />
            </div>
        </div>
    );
}
