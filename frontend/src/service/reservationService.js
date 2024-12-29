const API_BASE_URL = 'http://localhost:8080/api/reservations'; // 後端伺服器地址

// 創建預約
export const createReservation = async (reservationData) => {
  const url = API_BASE_URL;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(reservationData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || '創建預約失敗');
  }

  return response.json();
};

// 獲取選取日期的尚可預約時間
export const getAvailabilities = async (restaurantId, date) => {
  const url = `${API_BASE_URL}/${restaurantId}/${date}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || '無法獲取可用時間');
  }

  return response.json();
};

// 更新預約
export const updateReservation = async (id, reservationData) => {
  const url = `${API_BASE_URL}/reservation/${id}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
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
  const url = `${API_BASE_URL}/reservation/${id}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || '取消預約失敗');
  }

  return response.json();
};

// 用戶成功報到
export const finishReservation = async (id) => {
  const url = `${API_BASE_URL}/finish/${id}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || '預約無法完成');
  }

  return response.json();
};

// 獲取用戶預約
export const getUserReservations = async () => {
  const url = `${API_BASE_URL}/user`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || '無法獲取預約');
  }

  return response.json();
};

// 獲取用戶預約
export const getBusinessReservations = async () => {
  const url = `${API_BASE_URL}/business`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || '無法獲取預約');
  }

  return response.json();
};
