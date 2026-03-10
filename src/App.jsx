import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './services/api';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import GamesPage from './pages/GamesPage';
import ReportsPage from './pages/ReportsPage';
import ServerPage from './pages/ServerPage';
import TournamentsPage from './pages/TournamentsPage';
import PuzzlesPage from './pages/PuzzlesPage';

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout><DashboardPage /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminLayout><UsersPage /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/games"
          element={
            <ProtectedRoute>
              <AdminLayout><GamesPage /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute>
              <AdminLayout><ReportsPage /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tournaments"
          element={
            <ProtectedRoute>
              <AdminLayout><TournamentsPage /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/puzzles"
          element={
            <ProtectedRoute>
              <AdminLayout><PuzzlesPage /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/server"
          element={
            <ProtectedRoute>
              <AdminLayout><ServerPage /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
