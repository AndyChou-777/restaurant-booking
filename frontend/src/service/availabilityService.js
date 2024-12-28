const API_BASE_URL = 'http://localhost:8080/api/restaurants'; // 後端伺服器地址

// 獲取所有可用時間
export const getAllAvailabilities = async (restaurantId) => {
  const url = `${API_BASE_URL}/${restaurantId}/availabilities`;
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

// 根據 id 獲得餐廳當日可用時間
export const fetchAvailabilities = async (restaurantId) => {
  const url = `${API_BASE_URL}/${restaurantId}/availabilities`;
  const response = await fetch(url, {
    method: 'PUT',
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


// 添加可用時間
export const addAvailability = async (restaurantId, availabilityData) => {
  const url = `${API_BASE_URL}/${restaurantId}/availabilities`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(availabilityData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || '添加可用時間失敗');
  }

  return response.json();
};

// 更新可用時間
export const updateAvailability = async (restaurantId, availabilityId, availabilityData) => {
  const url = `${API_BASE_URL}/${restaurantId}/availabilities/${availabilityId}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(availabilityData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || '更新可用時間失敗');
  }

  return response.json();
};

// 刪除可用時間
export const deleteAvailability = async (restaurantId, availabilityId) => {
  const url = `${API_BASE_URL}/${restaurantId}/availabilities/${availabilityId}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || '刪除可用時間失敗');
  }

  return response.json();
};
