import React, { useState } from "react";
import "./LoginPage.css";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("regular"); // 默認選擇一般用戶登入

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password, userType); // 呼叫 onLogin 進行登入驗證，並傳遞使用者類型
  };

  return (
    <div className="login-page">
      
        <h2>會員登入</h2>

      <div className="user-type-selector">
        <button
          className={`user-type-button ${userType === "regular" ? "active" : ""}`}
          onClick={() => setUserType("regular")}
        >
          一般用戶登入
        </button>
        <button
          className={`user-type-button ${userType === "business" ? "active" : ""}`}
          onClick={() => setUserType("business")}
        >
          企業用戶登入
        </button>
      </div>

      {/* 一般用戶登入表單 */}
      {userType === "regular" && (
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">帳號：</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">密碼：</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            登入
          </button>
        </form>
      )}

      {/* 企業用戶登入表單 */}
      {userType === "business" && (
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">公司帳號：</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">密碼：</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            登入
          </button>
        </form>
      )}
    </div>
  );
}

export default LoginPage;
