import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from './context/AdminAuthContext';
import AdminSidebar from './components/AdminSidebar';
import AdminNavbar from './components/AdminNavbar';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import FoodList from './pages/FoodList';
import OrderList from './pages/OrderList';
import CategoryList from './pages/CategoryList';
import UserList from './pages/UserList';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProtectedLayout = ({ children, title }) => {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminNavbar title={title} />
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
};

function App() {
  const { isAuthenticated, loading } = useAdminAuth();

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={!loading && isAuthenticated ? <Navigate to="/" replace /> : <AdminLogin />}
        />
        <Route
          path="/"
          element={
            <ProtectedLayout title="Overview & Analytics">
              <Dashboard />
            </ProtectedLayout>
          }
        />
        <Route
          path="/foods"
          element={
            <ProtectedLayout title="Food Items Management">
              <FoodList />
            </ProtectedLayout>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedLayout title="Customer Orders">
              <OrderList />
            </ProtectedLayout>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedLayout title="Menu Categories">
              <CategoryList />
            </ProtectedLayout>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedLayout title="Registered Users">
              <UserList />
            </ProtectedLayout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;

