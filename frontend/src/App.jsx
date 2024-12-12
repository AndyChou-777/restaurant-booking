import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import Footer from './components/Footer';
import UserRegisterPage from './pages/UserRegisterPage';
import BusinessRegisterPage from './pages/BusinessRegisterPage';
import UserDashboard from './pages/UserDashboard';
import BusinessDashboard from './pages/BusinessDashboard';
import RestaurantBookingApp from './pages/RestaurantBookingApp';
import 'tailwindcss/tailwind.css'; // 引入 tailwindcss

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {/* 使用了新的 future flag，讓相對路徑解析行為提前符合 v7 的邏輯 */}

      <Header />
      
        {/* 定義路由 */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register/user" element={<UserRegisterPage />} />
          <Route path="/register/business" element={<BusinessRegisterPage />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/business/dashboard" element={<BusinessDashboard />} />
          <Route path="/restaurant-reservation" element={<RestaurantBookingApp />} />
        </Routes>
        
      <Footer />
    </Router>
  );
}

export default App;

