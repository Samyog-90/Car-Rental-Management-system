import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FleetPage from './pages/Fleet';

// Admin imports (placeholders for now until file creation)
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
// import Cars from './pages/admin/Cars';
// import Users from './pages/admin/Users';
// import Bookings from './pages/admin/Bookings';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/fleet" element={<FleetPage />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        {/* <Route path="cars" element={<Cars />} />
        <Route path="users" element={<Users />} />
        <Route path="bookings" element={<Bookings />} /> */}
      </Route>
    </Routes>
  );
};

export default App;