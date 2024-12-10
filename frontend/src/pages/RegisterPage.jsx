import React from 'react';
import { Link } from 'react-router-dom'; // 用於導航
import './RegisterPage.css';

function RegisterPage() {
  return (
    <div className="register-container">
      <div className="register-content">
        <h2>註冊會員</h2>
        <div className="user-selection">
          <div className="user-option">
            <h3>一般用戶</h3>
            <p>作為一般用戶，您可以輕鬆搜索餐廳、瀏覽餐廳評價，並享受預約服務。</p>
            <ul>
              <li>查看餐廳菜單</li>
              <li>餐廳評價</li>
              <li>預約餐廳座位</li>
            </ul>
            <Link to="/register/user">
              <button>立即註冊</button>
            </Link>
          </div>

          <div className="user-option">
            <h3>企業用戶</h3>
            <p>作為企業用戶，您可以上架您的餐廳，提供更多的選擇給顧客，並管理您的預約系統。</p>
            <ul>
              <li>上架餐廳</li>
              <li>管理餐廳預約</li>
              <li>專屬餐廳分析報告</li>
            </ul>
            <Link to="/register/business">
              <button>立即註冊</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
