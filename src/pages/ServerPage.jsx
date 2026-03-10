import { useState, useEffect } from 'react';
import { getServerInfo } from '../services/api';

export default function ServerPage() {
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchInfo = async () => {
        try {
            const data = await getServerInfo();
            setInfo(data);
        } catch (err) {
            console.error('Server info error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInfo();
        const interval = setInterval(fetchInfo, 5000);
        return () => clearInterval(interval);
    }, []);

    const formatUptime = (seconds) => {
        const d = Math.floor(seconds / 86400);
        const h = Math.floor((seconds % 86400) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${d}d ${h}h ${m}m ${s}s`;
    };

    if (loading) return <div className="page-loading"><span className="spinner-lg"></span></div>;

    return (
        <div className="page">
            <div className="page-header">
                <h1>Server Monitor</h1>
                <span className="live-badge">● LIVE</span>
            </div>

            <div className="server-grid">
                <div className="server-card">
                    <h3>⏱️ Uptime</h3>
                    <div className="server-value">{info ? formatUptime(info.uptime) : '—'}</div>
                </div>

                <div className="server-card">
                    <h3>🔌 Active Connections</h3>
                    <div className="server-value highlight">{info?.activeConnections || 0}</div>
                </div>

                <div className="server-card">
                    <h3>💾 Memory Usage</h3>
                    <div className="server-metrics">
                        <div className="metric">
                            <span className="metric-label">Heap Used</span>
                            <span className="metric-value">{info?.memoryUsage?.heapUsed || '—'}</span>
                        </div>
                        <div className="metric">
                            <span className="metric-label">Heap Total</span>
                            <span className="metric-value">{info?.memoryUsage?.heapTotal || '—'}</span>
                        </div>
                        <div className="metric">
                            <span className="metric-label">RSS</span>
                            <span className="metric-value">{info?.memoryUsage?.rss || '—'}</span>
                        </div>
                    </div>
                </div>

                <div className="server-card">
                    <h3>⚙️ Runtime</h3>
                    <div className="server-metrics">
                        <div className="metric">
                            <span className="metric-label">Node.js</span>
                            <span className="metric-value">{info?.nodeVersion || '—'}</span>
                        </div>
                        <div className="metric">
                            <span className="metric-label">Platform</span>
                            <span className="metric-value">{info?.platform || '—'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
