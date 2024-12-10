import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-[#333] flex justify-between items-center p-[10px_20px] text-white relative">
      <div className="flex items-center">
        <img 
          src="/home_logo.png" 
          alt="餐廳預約網站 Logo" 
          className="w-[50px] h-auto mr-[10px]" 
        />
        <span className="text-2xl font-bold">餐廳預約網站</span>
      </div>
      
      {/* 導航和漢堡選單容器 */}
      <div className="flex items-center">
        {/* 桌面版導航 */}
        <nav className={`flex gap-[10px] items-center
          max-md:hidden 
          md:flex`}
        >
          <Link to="/restaurant-reservation">
            <button className="bg-[#008CBA] text-white px-4 py-2 text-base 
              border-none rounded-md cursor-pointer 
              transition-colors duration-300 hover:bg-[#007B8F]">
              預約網頁
            </button>
          </Link>
          <Link to="/login">
            <button className="bg-[#008CBA] text-white px-4 py-2 text-base 
              border-none rounded-md cursor-pointer 
              transition-colors duration-300 hover:bg-[#007B8F]">
              會員登入
            </button>
          </Link>
          <Link to="/register">
            <button className="bg-[#008CBA] text-white px-4 py-2 text-base 
              border-none rounded-md cursor-pointer 
              transition-colors duration-300 hover:bg-[#007B8F]">
              註冊會員
            </button>
          </Link>
        </nav>

        {/* 漢堡選單 */}
        <div 
          className="flex flex-col gap-[5px] cursor-pointer ml-4" 
          onClick={toggleMenu}
        >
          <div className={`w-[30px] h-[4px] bg-white transition-all duration-300 
            ${isMenuOpen ? 'transform translate-y-[9px] rotate-45' : ''}`}></div>
          <div className={`w-[30px] h-[4px] bg-white transition-all duration-300 
            ${isMenuOpen ? 'opacity-0' : ''}`}></div>
          <div className={`w-[30px] h-[4px] bg-white transition-all duration-300 
            ${isMenuOpen ? 'transform -translate-y-[9px] -rotate-45' : ''}`}></div>
        </div>
      </div>

      {/* 點擊漢堡選單後顯示的下拉選單 */}
      {isMenuOpen && (
        <div className="block absolute top-[60px] right-0 
          bg-[#333] flex-col w-[200px] z-10 
          rounded-md shadow-md py-[10px]">
          <Link 
            to="/" 
            className="text-white block py-3 px-5 text-base 
            border-b border-[#555] hover:bg-[#555]"
          >
            回到首頁
          </Link>
          <Link 
            to="/user/dashboard" 
            className="text-white block py-3 px-5 text-base 
            border-b border-[#555] hover:bg-[#555]"
          >
            個人頁面
          </Link>
          <Link 
            to="/business/dashboard" 
            className="text-white block py-3 px-5 text-base 
            hover:bg-[#555]"
          >
            餐廳管理
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;


