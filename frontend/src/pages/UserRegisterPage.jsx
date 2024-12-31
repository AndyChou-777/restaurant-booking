import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerGeneralUser } from '@/service/authService'
import { useNavigate } from 'react-router-dom'
import { UsersRound, Mails, LockKeyhole, ShieldCheck } from 'lucide-react';

function UserRegisterPage( {showTemporaryAlert} ) {
  const [isIntroPhase, setIsIntroPhase] = useState(true)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showTemporaryAlert('密碼錯誤', '密碼確認不符，請重新輸入!', 'error');
      return;
    }

    try {
      const data = await registerGeneralUser(name, email, password);

      if (data.message === "一般用戶註冊成功!") {
        showTemporaryAlert('註冊成功', '用戶註冊成功，請登入後進行操作!', 'check', '/login');
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
      {/* 左側一般會員介紹區域 */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-r from-pink-500 to-red-500 p-8">
        {isIntroPhase ? (
          <div className="text-center space-y-6 max-w-md bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-extrabold text-gray-800">成為一般會員的優勢</h1>
            <div className="space-y-4 text-gray-600">
              {/* 介紹區域 */}
              <div className="flex items-center justify-start space-x-4">
                <img 
                  src="/re4.svg" 
                  alt="個人化推薦" 
                  className="w-16 h-16 rounded-full bg-gray-200 p-2"
                />
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-center">專屬推薦</h3>
                  <p>瀏覽平台上各式餐廳，獲得專屬個性化推薦</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <img 
                  src="/re5.svg" 
                  alt="會員優惠" 
                  className="w-16 h-16 rounded-full bg-gray-200 p-2"
                />
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-center">會員優惠</h3>
                  <p>預約心宜的餐廳，及時獲取餐廳的最新優惠</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <img 
                  src="/re6.svg" 
                  alt="輕鬆訂位" 
                  className="w-16 h-16 rounded-full bg-gray-200 p-2"
                />
                <div className="text-center">
                  <h3 className="text-xl font-semibold">輕鬆訂位</h3>
                  <p>一鍵搜索平台熱門餐廳，輕鬆預約適合時段</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => setIsIntroPhase(false)}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:scale-105 transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500"
              style={{ height: 'auto', borderRadius: '8px' }}
            >
              立即開始註冊
            </Button>
          </div>
        ) : (
          <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-extrabold text-center text-gray-800">一般用戶註冊</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className='flex text-black font-bold'>
                  <UsersRound />
                  <p className='text-lg ml-2'>用戶姓名</p>
                  </Label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="輸入您的姓名"
                  required
                  className="mt-2"
                />
              </div>
              <div>
                <Label className='flex text-black font-bold'>
                  <Mails />
                  <p className='text-lg ml-2'>電子郵件</p>
                </Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="輸入電子郵件"
                  required
                  className="mt-2"
                />
              </div>
              <div>
                <Label className='flex text-black font-bold'>
                  <LockKeyhole />
                  <p className='text-lg ml-2'>帳戶密碼</p>
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
              <Button type="submit" className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:scale-105 transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500"
                      style={{ height: 'auto', borderRadius: '8px' }}>
                提交註冊
              </Button>
              <div className="text-center text-sm text-indigo-500">
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
          backgroundImage: 'url("/re10.jpg")'
        }}
      >
      </div>
    </div>
  )
}

export default UserRegisterPage
