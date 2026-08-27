import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/public/HomePage';
import { StoryListPage } from './pages/public/StoryListPage';
import { StoryDetailPage } from './pages/public/StoryDetailPage';
import { AboutPage } from './pages/public/AboutPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { StoryEditorPage } from './pages/admin/StoryEditorPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { useAuth } from './context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-stone-800 dark:border-stone-200 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col justify-between bg-cream-50 dark:bg-chocolate-950 text-chocolate-900 dark:text-cream-100 font-inter transition-colors duration-200">
        <div>
          <Navbar />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/stories" element={<StoryListPage />} />
              <Route path="/story/:slug" element={<StoryDetailPage />} />
              <Route path="/about" element={<AboutPage />} />

              {/* Admin Auth Route */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Protected Owner/Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/stories"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/stories/new"
                element={
                  <ProtectedRoute>
                    <StoryEditorPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/stories/:id/edit"
                element={
                  <ProtectedRoute>
                    <StoryEditorPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute>
                    <AdminSettingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all 404 redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
};
