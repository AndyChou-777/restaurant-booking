import React, { useState, useEffect } from "react";
import "./UserDashboard.css";

// 假設從 API 獲取用戶數據
const fetchUserData = () => {
  return {
    name: "張三",
    email: "zhangsan@example.com",
    orders: [
      {
        id: 1,
        restaurant: "餐廳A",
        date: "2024-12-01",
        status: "已完成",
      },
      {
        id: 2,
        restaurant: "餐廳B",
        date: "2024-12-05",
        status: "待處理",
      },
    ],
    notifications: [
      { id: 1, message: "您的訂單在餐廳A已確認" },
      { id: 2, message: "餐廳B有新的優惠活動" },
    ],
  };
};

function UserDashboard() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    const data = fetchUserData();
    setUserData(data);
    setNewName(data.name);
    setNewEmail(data.email);
  }, []);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    setUserData((prevData) => ({
      ...prevData,
      name: newName,
      email: newEmail,
    }));
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setNewName(userData.name);
    setNewEmail(userData.email);
    setIsEditing(false);
  };

  if (!userData) return <div>載入中...</div>;

  return (
    <div className="dashboard-container">
      <h1>會員後台</h1>

      {/* 個人資料管理 */}
      <section className="profile-section">
        <h2>個人資料</h2>
        {isEditing ? (
          <div>
            <div className="form-group">
              <label>姓名</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <button onClick={handleSaveProfile}>儲存</button>
            <button onClick={handleCancelEdit}>取消</button>
          </div>
        ) : (
          <div>
            <p><strong>姓名：</strong>{userData.name}</p>
            <p><strong>Email：</strong>{userData.email}</p>
            <button onClick={handleEditProfile}>編輯資料</button>
          </div>
        )}
      </section>

      {/* 訂單管理 */}
      <section className="orders-section">
        <h2>訂單管理</h2>
        <table>
          <thead>
            <tr>
              <th>訂單編號</th>
              <th>餐廳</th>
              <th>日期</th>
              <th>狀態</th>
            </tr>
          </thead>
          <tbody>
            {userData.orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.restaurant}</td>
                <td>{order.date}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 通知和消息管理 */}
      <section className="notifications-section">
        <h2>通知</h2>
        <ul>
          {userData.notifications.map((notification) => (
            <li key={notification.id}>{notification.message}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default UserDashboard;
