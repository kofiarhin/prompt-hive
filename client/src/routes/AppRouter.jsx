import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import HomePage from "../pages/HomePage";
import ExplorePage from "../pages/ExplorePage";
import ContentDetailPage from "../pages/ContentDetailPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardOverviewPage from "../pages/DashboardOverviewPage";
import DashboardSavedPage from "../pages/DashboardSavedPage";
import DashboardContentPage from "../pages/DashboardContentPage";
import DashboardContentCreatePage from "../pages/DashboardContentCreatePage";
import DashboardContentEditPage from "../pages/DashboardContentEditPage";
import AdminContentPage from "../pages/AdminContentPage";
import AdminContentCreatePage from "../pages/AdminContentCreatePage";
import AdminUsersPage from "../pages/AdminUsersPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/content/:slug" element={<ContentDetailPage />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardOverviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/saved"
          element={
            <ProtectedRoute>
              <DashboardSavedPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/content"
          element={
            <ProtectedRoute>
              <DashboardContentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/content/new"
          element={
            <ProtectedRoute>
              <DashboardContentCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/content/:id/edit"
          element={
            <ProtectedRoute>
              <DashboardContentEditPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/content"
          element={
            <ProtectedRoute adminOnly>
              <AdminContentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/content/new"
          element={
            <ProtectedRoute adminOnly>
              <AdminContentCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
