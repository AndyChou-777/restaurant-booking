import React, { useState } from 'react';
import "./BusinessRegisterPage.css";

function BusinessRegisterPage() {
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [representative, setRepresentative] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('企業用戶註冊成功！');
    // 提交表單後的處理邏輯
  };

  return (
    <div className="register-form">
      <h2>企業用戶註冊</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>餐廳名稱</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>餐廳地址</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label>負責人姓名</label>
          <input
            type="text"
            value={representative}
            onChange={(e) => setRepresentative(e.target.value)}
            required
          />
        </div>
        <button type="submit">註冊</button>
      </form>
    </div>
  );
}

export default BusinessRegisterPage;
