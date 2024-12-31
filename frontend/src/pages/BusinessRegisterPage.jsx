import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerBusinessUser } from '@/service/authService'
import { Building2, Mails, LockKeyhole, ShieldCheck } from 'lucide-react';

function BusinessRegisterPage( {showTemporaryAlert} ) {
  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (password !== confirmPassword) {
        showTemporaryAlert('密碼錯誤', '密碼確認不符，請重新輸入!', 'error');
        return;
      }
  
      try {
        const data = await registerBusinessUser(businessName, email, password);
  
        if (data.message === "商業用戶註冊成功!") {
          showTemporaryAlert('註冊成功', '企業用戶註冊成功，請登入後進行操作!', 'check', '/login');
        } else {
          showTemporaryAlert('註冊失敗', '用戶註冊失敗，請重新註冊或稍後再試!', 'error');
        }
      } catch (error) {
        console.error("註冊錯誤:", error);
        showTemporaryAlert('伺服器錯誤', '伺服器或網路連接錯誤，請稍後再試!', 'error');
      }
    };

  return (
    <div className="flex h-screen">
      {/* 左側企業會員介紹區域 */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 p-8">
        {isIntroPhase ? (
          <div className="text-center space-y-6 max-w-md bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-extrabold text-gray-800">成為企業會員的優勢</h1>
            <div className="space-y-4 text-gray-600">
              {/* 優勢 1 - 增加曝光度 */}
              <div className="flex items-center justify-start space-x-4">
                <img 
                  src="/re4.svg" 
                  alt="增加曝光度"
                  className="w-16 h-16 rounded-full bg-gray-200 p-2"
                />
                <div>
                  <h3 className="text-xl font-semibold text-center mb-2">高曝光度</h3>
                  <p>掌握來自全球的用戶，顯著提升餐廳曝光度</p>
                </div>
              </div>
              {/* 優勢 2 - 數據分析 */}
              <div className="flex items-center justify-start space-x-4">
                <img 
                  src="/re5.svg" 
                  alt="數據分析"
                  className="w-16 h-16 rounded-full bg-gray-200 p-2"
                />
                <div>
                  <h3 className="text-xl font-semibold text-center mb-2">輕鬆上架</h3>
                  <p>無須任何額外費用，即可體驗完整平台功能</p>
                </div>
              </div>
              {/* 優勢 3 - 客戶管理 */}
              <div className="flex items-center justify-start space-x-4">
                <img 
                  src="/re6.svg" 
                  alt="客戶管理"
                  className="w-16 h-16 rounded-full bg-gray-200 p-2"
                />
                <div>
                  <h3 className="text-xl font-semibold text-center mb-2">一鍵管理</h3>
                  <p>輕鬆管理所有旗下餐廳的資料、預約和狀態</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => setIsIntroPhase(false)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:scale-105 transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ height: 'auto', borderRadius: '8px' }}
            >
              立即開始註冊
            </Button>
          </div>
        ) : (
          <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-extrabold text-center text-gray-800">企業用戶註冊</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className='flex text-black font-bold'>
                  <Building2 />
                  <p className='text-lg ml-2'>企業名稱</p>
                </Label>
                <Input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="輸入企業名稱"
                  required
                  className="mt-2"
                />
              </div>
              <div>
                <Label className='flex text-black font-bold'>
                  <Mails />
                  <p className='text-lg ml-2'>企業信箱</p>
                </Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="輸入企業電子郵件"
                  required
                  className="mt-2"
                />
              </div>
              <div>
                <Label className='flex text-black font-bold'>
                  <LockKeyhole />
                  <p className='text-lg ml-2'>設定密碼</p>
                </Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="設定密碼"
                  minLength="8" // 密碼至少 8 字
                  required
                  className="mt-2"
                />
              </div>
              <div>
                <Label className='flex text-black font-bold'>
                  <ShieldCheck />
                  <p className='text-lg ml-2'>確認密碼</p>
                </Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="再次輸入密碼"
                  required
                  className="mt-2"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:scale-105 transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ height: 'auto', borderRadius: '8px' }}
              >
                提交註冊
              </Button>
              <div className="text-center text-sm text-pink-500">
                <Button 
                  variant="link" 
                  onClick={() => setIsIntroPhase(true)}
                >
                  回到會員優勢介紹
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* 右側背景圖 */}
      <div 
        className="hidden md:block w-1/2 bg-cover bg-center rounded-l-lg" 
        style={{
          backgroundImage: 'url("/re3.jpg")'
        }}
      >
      </div>
    </div>
  )
}

export default BusinessRegisterPage

