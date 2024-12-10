import React, { useState } from 'react';
import './BusinessDashboard.css';

function BusinessDashboard() {
  // 當前選中的tab
  const [activeTab, setActiveTab] = useState('restaurant');

  // 餐廳基本信息
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: '餐廳名稱',
    address: '餐廳地址',
    phone: '餐廳電話',
    website: '餐廳網站',
    hours: '營業時間'
  });

  // 菜單
  const [menuItems, setMenuItems] = useState([
    { name: '菜品1', price: '100元', description: '美味的菜品' },
    { name: '菜品2', price: '150元', description: '更美味的菜品' }
  ]);

  // 預約
  const [reservations, setReservations] = useState([
    { id: '001', name: '顧客1', time: '2024-12-05 19:00', people: 4 },
    { id: '002', name: '顧客2', time: '2024-12-06 20:00', people: 2 }
  ]);

  // 控制彈窗的顯示
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  // 更新餐廳基本信息
  const handleEditRestaurantInfo = () => {
    setIsEditModalOpen(true);
  };

  // 提交編輯餐廳信息
  const handleSubmitEditRestaurant = () => {
    alert('餐廳信息已更新');
    setIsEditModalOpen(false);
  };

  // 添加菜品
  const handleAddMenuItem = () => {
    setIsAddItemModalOpen(true);
  };

  // 提交菜品
  const handleSubmitAddMenuItem = () => {
    alert('菜品已添加');
    setIsAddItemModalOpen(false);
  };

  // 刪除菜品
  const handleDeleteMenuItem = (index) => {
    const updatedMenu = menuItems.filter((item, i) => i !== index);
    setMenuItems(updatedMenu);
  };

  // 接受預約
  const handleAcceptReservation = (id) => {
    alert(`接受預約 ${id}`);
  };

  // 拒絕預約
  const handleRejectReservation = (id) => {
    alert(`拒絕預約 ${id}`);
  };

  return (
    <div className="business-dashboard-container">
      <h2>企業用戶後台</h2>
      <div className="tabs">
        <button onClick={() => setActiveTab('restaurant')} className={activeTab === 'restaurant' ? 'active' : ''}>餐廳管理</button>
        <button onClick={() => setActiveTab('orders')} className={activeTab === 'orders' ? 'active' : ''}>預約管理</button>
      </div>

      {/* 餐廳管理 */}
      {activeTab === 'restaurant' && (
        <div className="restaurant-management">
          <h3>餐廳基本信息</h3>
          <div>
            <p>名稱：{restaurantInfo.name}</p>
            <p>地址：{restaurantInfo.address}</p>
            <p>電話：{restaurantInfo.phone}</p>
            <p>網站：{restaurantInfo.website}</p>
            <p>營業時間：{restaurantInfo.hours}</p>
          </div>
          <button onClick={handleEditRestaurantInfo}>編輯信息</button>

          <h3>菜單管理</h3>
          <ul>
            {menuItems.map((item, index) => (
              <li key={index}>
                {item.name} - {item.price} - {item.description}
                <button onClick={() => handleDeleteMenuItem(index)}>刪除</button>
              </li>
            ))}
          </ul>
          <button onClick={handleAddMenuItem}>添加菜品</button>

          <h3>照片管理</h3>
          <input type="file" onChange={(e) => alert('上傳照片: ' + e.target.files[0].name)} />
        </div>
      )}

      {/* 預約管理 */}
      {activeTab === 'orders' && (
        <div className="reservation-management">
          <h3>預約管理</h3>
          <ul>
            {reservations.map((reservation) => (
              <li key={reservation.id}>
                預約編號: {reservation.id} - 顧客名稱: {reservation.name} - 預約時間: {reservation.time} - 人數: {reservation.people}
                <button onClick={() => handleAcceptReservation(reservation.id)}>接受</button>
                <button onClick={() => handleRejectReservation(reservation.id)}>拒絕</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 編輯餐廳基本信息的彈窗 */}
      {isEditModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>編輯餐廳基本信息</h3>
            <input
              type="text"
              placeholder="餐廳名稱"
              value={restaurantInfo.name}
              onChange={(e) => setRestaurantInfo({ ...restaurantInfo, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="餐廳地址"
              value={restaurantInfo.address}
              onChange={(e) => setRestaurantInfo({ ...restaurantInfo, address: e.target.value })}
            />
            <input
              type="text"
              placeholder="餐廳電話"
              value={restaurantInfo.phone}
              onChange={(e) => setRestaurantInfo({ ...restaurantInfo, phone: e.target.value })}
            />
            <input
              type="text"
              placeholder="餐廳網站"
              value={restaurantInfo.website}
              onChange={(e) => setRestaurantInfo({ ...restaurantInfo, website: e.target.value })}
            />
            <input
              type="text"
              placeholder="營業時間"
              value={restaurantInfo.hours}
              onChange={(e) => setRestaurantInfo({ ...restaurantInfo, hours: e.target.value })}
            />
            <button onClick={handleSubmitEditRestaurant}>提交</button>
            <button onClick={() => setIsEditModalOpen(false)}>取消</button>
          </div>
        </div>
      )}

      {/* 添加菜品的彈窗 */}
      {isAddItemModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>添加菜品</h3>
            <input type="text" placeholder="菜品名稱" />
            <input type="text" placeholder="價格" />
            <textarea placeholder="描述"></textarea>
            <button onClick={handleSubmitAddMenuItem}>添加</button>
            <button onClick={() => setIsAddItemModalOpen(false)}>取消</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BusinessDashboard;
