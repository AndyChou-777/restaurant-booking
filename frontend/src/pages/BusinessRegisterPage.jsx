import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function BusinessRegisterPage() {
  const [isIntroPhase, setIsIntroPhase] = useState(true)
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [representative, setRepresentative] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('企業用戶註冊成功！')
    // 提交表單後的處理邏輯
  }

  return (
    <div className="flex h-screen">
      {/* 左側企業會員介紹區域 */}
      <div className="w-1/2 flex items-center justify-center bg-gray-100 p-8">
        {isIntroPhase ? (
          <div className="text-center space-y-6 max-w-md">
            <h1 className="text-3xl font-bold text-gray-800">成為企業會員的優勢</h1>
            <div className="space-y-4 text-gray-600">
              <div>
                <h3 className="text-xl font-semibold mb-2">增加曝光度</h3>
                <p>透過平台推薦，提升您的餐廳知名度和客源</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">數據分析</h3>
                <p>獲得詳細的顧客訂單和喜好分析，優化經營策略</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">客戶管理</h3>
                <p>簡化訂單流程，提升顧客體驗和忠誠度</p>
              </div>
            </div>
            <Button 
              onClick={() => setIsIntroPhase(false)}
              className="w-full mt-6 bg-blue-400"
            >
              立即開始註冊
            </Button>
          </div>
        ) : (
          <div className="w-full max-w-md space-y-6">
            <h2 className="text-2xl font-bold text-center">企業用戶註冊</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>餐廳名稱</Label>
                <Input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="輸入餐廳名稱"
                  required
                  className="mt-2"
                />
              </div>
              <div>
                <Label>電子郵件</Label>
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
                <Label>餐廳地址</Label>
                <Input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="輸入餐廳地址"
                  required
                  className="mt-2"
                />
              </div>
              <div>
                <Label>負責人姓名</Label>
                <Input
                  type="text"
                  value={representative}
                  onChange={(e) => setRepresentative(e.target.value)}
                  placeholder="輸入負責人姓名"
                  required
                  className="mt-2"
                />
              </div>
              <Button type="submit" className="w-full">
                提交註冊
              </Button>
              <div className="text-center text-sm text-gray-600">
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
        className="w-1/2 bg-cover bg-center" 
        style={{
          backgroundImage: 'url("/re3.jpg")'
        }}
      >
      </div>
    </div>
  )
}

export default BusinessRegisterPage