const API_BASE_URL = 'http://localhost:8080/omotenashi'; // 後端伺服器地址

// 註冊一般用戶
export const registerGeneralUser = async (username, email, password) => {
  const url = `${API_BASE_URL}/register/general`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password}),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || '一般用戶註冊失敗!');
  }

  return response.json();
};

// 註冊商業用戶
export const registerBusinessUser = async (businessName, email, password) => {
  const url = `${API_BASE_URL}/register/business`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ businessName, email, password}),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || '商業用戶註冊失敗!');
  }

  return response.json();
};

// 登入
export const login = async (email, password) => {
  const url = `${API_BASE_URL}/login`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: "include",
    body: JSON.stringify({ email, password}),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || '登入失敗');
  }

  return response.json();
};

// 登出
export const logout = async () => {
  const url = `${API_BASE_URL}/logout`;
  const response = await fetch(url, {
    method: 'GET',
    credentials: "include",
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || '登出失敗');
  }

  return response.json();
};

// 檢查用戶登入狀態
export const checkSession = async () => {
  const url = `${API_BASE_URL}/session`;
  const response = await fetch(url, {
    method: 'GET',
    credentials: "include",
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || '未登入');
  }

  return response.json();
};