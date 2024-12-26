const API_BASE_URL = 'http://localhost:8080/api/restaurants'; // 後端伺服器地址

// 創建餐廳
export const createRestaurant = async (restaurantData) => {
  const url = `${API_BASE_URL}/create`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(restaurantData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || '創建餐廳失敗');
  }

  return response.json();
};

// 更新餐廳
export const updateRestaurant = async (id, restaurantData) => {
  const url = `${API_BASE_URL}/restaurants/${id}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(restaurantData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || '更新餐廳失敗');
  }

  return response.json();
};

// 刪除餐廳
export const deleteRestaurant = async (id) => {
  const url = `${API_BASE_URL}/restaurants/${id}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || '刪除餐廳失敗');
  }

  return response.json();
};

// 搜索餐廳
export const searchRestaurants = async (searchData = {}) => {
  const url = API_BASE_URL;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(searchData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || '搜索餐廳失敗');
  }

  return response.json();
};


// 獲取所有餐廳
export const getAllRestaurants = async () => {
  const url = API_BASE_URL;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || '餐廳加載失敗');
  }

  return response.json();
};

// 獲取旗下餐廳
export const fetchRestaurants = async () => {
  const url = `${API_BASE_URL}/search`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || '餐廳加載失敗');
  }

  return response.json();
};