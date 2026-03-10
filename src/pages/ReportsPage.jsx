import { useState, useEffect } from 'react';
import { getReports, updateReport } from '../services/api';

export default function ReportsPage() {
    const [reports, setReports] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const data = await getReports({ page, status: statusFilter, limit: 15 });
            setReports(data.reports || []);
            setTotal(data.total || 0);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            console.error('Fetch reports error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchReports(); }, [page, statusFilter]);

    const handleStatusChange = async (reportId, newStatus) => {
        const notes = prompt('Admin notes (optional):') || '';
        setActionLoading(reportId);
        try {
            await updateReport(reportId, { status: newStatus, admin_notes: notes });
            fetchReports();
        } catch (err) {
            alert('Failed: ' + err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (d) => {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'pending': return 'status-pending';
            case 'reviewed': return 'status-reviewed';
            case 'resolved': return 'status-resolved';
            case 'dismissed': return 'status-dismissed';
            default: return '';
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>Cheat Reports</h1>
                <span className="badge">{total} reports</span>
            </div>

            <div className="filter-bar">
                {['all', 'pending', 'reviewed', 'resolved', 'dismissed'].map((s) => (
                    <button
                        key={s}
                        className={`filter-btn ${statusFilter === s ? 'filter-active' : ''}`}
                        onClick={() => { setStatusFilter(s); setPage(1); }}
                    >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="page-loading"><span className="spinner-lg"></span></div>
            ) : (
                <>
                    <div className="reports-list">
                        {reports.map((report) => (
                            <div key={report.id} className="report-card">
                                <div className="report-header">
                                    <span className={`status-badge ${getStatusClass(report.status)}`}>
                                        {report.status}
                                    </span>
                                    <span className="report-date">{formatDate(report.created_at)}</span>
                                </div>
                                <div className="report-body">
                                    <div className="report-field">
                                        <span className="label">Reporter:</span>
                                        <span>{report.reporter_id?.slice(0, 8) || '—'}</span>
                                    </div>
                                    <div className="report-field">
                                        <span className="label">Reported:</span>
                                        <span className="text-danger">{report.reported_id?.slice(0, 8) || '—'}</span>
                                    </div>
                                    <div className="report-field">
                                        <span className="label">Game:</span>
                                        <span>{report.game_id?.slice(0, 8) || 'N/A'}</span>
                                    </div>
                                    <div className="report-reason">
                                        <span className="label">Reason:</span>
                                        <p>{report.reason}</p>
                                    </div>
                                    {report.admin_notes && (
                                        <div className="report-notes">
                                            <span className="label">Admin Notes:</span>
                                            <p>{report.admin_notes}</p>
                                        </div>
                                    )}
                                </div>
                                {report.status === 'pending' && (
                                    <div className="report-actions">
                                        <button
                                            className="btn-sm btn-warning"
                                            onClick={() => handleStatusChange(report.id, 'reviewed')}
                                            disabled={actionLoading === report.id}
                                        >Mark Reviewed</button>
                                        <button
                                            className="btn-sm btn-success"
                                            onClick={() => handleStatusChange(report.id, 'resolved')}
                                            disabled={actionLoading === report.id}
                                        >Resolve</button>
                                        <button
                                            className="btn-sm btn-secondary"
                                            onClick={() => handleStatusChange(report.id, 'dismissed')}
                                            disabled={actionLoading === report.id}
                                        >Dismiss</button>
                                    </div>
                                )}
                                {report.status === 'reviewed' && (
                                    <div className="report-actions">
                                        <button
                                            className="btn-sm btn-success"
                                            onClick={() => handleStatusChange(report.id, 'resolved')}
                                            disabled={actionLoading === report.id}
                                        >Resolve</button>
                                        <button
                                            className="btn-sm btn-secondary"
                                            onClick={() => handleStatusChange(report.id, 'dismissed')}
                                            disabled={actionLoading === report.id}
                                        >Dismiss</button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {reports.length === 0 && (
                            <div className="empty-state">
                                <span className="empty-icon">✅</span>
                                <p>No reports found</p>
                            </div>
                        )}
                    </div>

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
