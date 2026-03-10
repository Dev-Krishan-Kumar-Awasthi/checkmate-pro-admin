const API_BASE = import.meta.env.VITE_API_URL || '/api/admin';

// Get stored token
const getToken = () => localStorage.getItem('admin_token');

// Authenticated fetch wrapper
const apiFetch = async (endpoint, options = {}) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
    };

    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

    if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('admin_token');
        window.location.href = '/login';
        throw new Error('Unauthorized');
    }

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(err.error || 'Request failed');
    }

    return res.json();
};

// Auth
export const loginAdmin = async (email, password) => {
    // Use Supabase auth directly from the client
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY
        },
        body: JSON.stringify({ email, password })
    });

    if (!res.ok) throw new Error('Invalid credentials');

    const data = await res.json();
    localStorage.setItem('admin_token', data.access_token);
    return data;
};

export const logout = () => {
    localStorage.removeItem('admin_token');
    window.location.href = '/login';
};

export const isAuthenticated = () => !!getToken();

// Dashboard
export const getStats = () => apiFetch('/stats');

// Users
export const getUsers = (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/users?${query}`);
};
export const getUser = (id) => apiFetch(`/users/${id}`);
export const banUser = (id, ban, reason) =>
    apiFetch(`/users/${id}/ban`, {
        method: 'POST',
        body: JSON.stringify({ ban, reason })
    });

// Games
export const getGames = (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/games?${query}`);
};
export const getGame = (id) => apiFetch(`/games/${id}`);

// Reports
export const getReports = (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/reports?${query}`);
};
export const updateReport = (id, data) =>
    apiFetch(`/reports/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    });

// Server
export const getServerInfo = () => apiFetch('/server');

// Tournaments
export const getTournaments = () => apiFetch('/tournaments');
export const createTournament = (data) =>
    apiFetch('/tournaments', { method: 'POST', body: JSON.stringify(data) });
export const deleteTournament = (id) =>
    apiFetch(`/tournaments/${id}`, { method: 'DELETE' });

// Puzzles
export const getPuzzles = () => apiFetch('/puzzles');
export const createPuzzle = (data) =>
    apiFetch('/puzzles', { method: 'POST', body: JSON.stringify(data) });
export const deletePuzzle = (id) =>
    apiFetch(`/puzzles/${id}`, { method: 'DELETE' });
export const setDailyPuzzle = (id) =>
    apiFetch(`/puzzles/${id}/daily`, { method: 'POST' });
