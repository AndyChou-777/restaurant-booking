import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
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
import { useState, useEffect } from 'react';
import { checkSession, logout, login} from './service/authService';
import { AlertCircle } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

function App() {

  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState({ title: '', description: '' });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  const [searchParams, setSearchParams] = useState({
      keyword: '',
      minPrice: null,
      maxPrice: null,
      location: '',
      tag: '',
    });

  useEffect(() => {

  const initializeLoginStatus = async () => {
    try {
      const apiResponse = await checkSession(); // 使用判斷是否已登入服務方法
      
      if (apiResponse.message === '登入成功') {
        setIsLoggedIn(true);
        apiResponse.data.role === 'GENERAL_USER' ? setUserRole('GENERAL_USER') : setUserRole('BUSINESS_USER');
      }

    } catch (error) {
      console.error("無法檢查登入狀態:", error);
      alert("無法連接到伺服器，請檢查網路連線或伺服器狀態。");
    }
  };

  initializeLoginStatus();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const apiResponse = await login(email, password);
      
      if (apiResponse.data.role === 'GENERAL_USER') {
        setIsLoggedIn(true);
        setUserRole('GENERAL_USER');
        alert('登入成功!');
        window.location.href = '/user/dashboard' ;
      } else if (apiResponse.data.role === 'BUSINESS_USER') {
        setIsLoggedIn(true);
        setUserRole('BUSINESS_USER');
        alert('登入成功!');
        window.location.href = '/business/dashboard';
      }
    } catch (error) {
      console.error(error.message || '登入失敗');
      alert('登入失敗，請檢查帳號密碼!');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      setUserRole('');
    } catch (error) {
      console.error("登出錯誤:", error);
    }
  };

  const showTemporaryAlert = (title, description, redirect) => {  // 添加 redirect 參數，預設跳轉到首頁
    setAlertContent({ title, description });
    setShowAlert(true);
  
    setTimeout(() => {
      setShowAlert(false);
      if (redirect !== null && redirect !== undefined) {
      window.location.href = redirect;  // 直接使用 window.location.href 跳轉
      }
    }, 3000);
  };

  return (

  
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    {/* 使用了新的 future flag，讓相對路徑解析行為提前符合 v7 的邏輯 */}

      {/* Alert 控制組件 */}
      {showAlert && (
        <Alert className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black border border-black p-4 shadow-lg z-50 w-[500px] rounded-[8px]">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className='font-bold'>{alertContent.title}</AlertTitle>
          <AlertDescription>
            {alertContent.description}
          </AlertDescription>
        </Alert>
      )}

      <Header isLoggedIn={isLoggedIn} userRole={userRole} handleLogout={handleLogout} showTemporaryAlert={showTemporaryAlert} />
      
        {/* 定義路由 */}
        <Routes>
          <Route path="/" element={<Home searchParams={searchParams} setSearchParams={setSearchParams} />} />
          <Route path="/login" element={<LoginPage handleLogin={handleLogin} />} />
          <Route path="/register/user" element={<UserRegisterPage />} />
          <Route path="/register/business" element={<BusinessRegisterPage />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/business/dashboard" element={<BusinessDashboard />} />
          <Route path="/restaurant-reservation" element={<RestaurantBookingApp searchParams={searchParams} setSearchParams={setSearchParams} showTemporaryAlert={showTemporaryAlert} />} />
        </Routes>
        
      <Footer />
    </Router>
  );
}

export default App;


