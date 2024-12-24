const API_BASE_URL = 'http://localhost:8080/omotenashi'; // 後端伺服器地址

// 創建預約
export const createReservation = async (reservationData) => {
  const url = `${API_BASE_URL}/omotenashi`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reservationData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || '創建預約失敗');
  }

  return response.json();
};

// 更新預約
export const updateReservation = async (id, reservationData) => {
  const url = `${API_BASE_URL}/omotenashi/reservation/${id}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reservationData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || '更新預約失敗');
  }

  return response.json();
};

// 取消預約
export const cancelReservation = async (id) => {
  const url = `${API_BASE_URL}/omotenashi/reservation/${id}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || '取消預約失敗');
  }

  return response.json();
};

// 獲取用戶預約
export const getUserReservations = async (userId) => {
  const url = `${API_BASE_URL}/omotenashi/user/${userId}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || '無法獲取預約');
  }

  return response.json();
};
