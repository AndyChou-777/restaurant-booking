import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // 引入样式文件
import Main from './Main'; // 引入你之前创建的 Main 组件
import './index.css';

// 获取根节点并渲染 Main 组件
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Main /> {/* 渲染 Main 组件 */}
  </React.StrictMode>
);
