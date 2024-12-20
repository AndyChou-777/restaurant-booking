import React, { useState, useEffect } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, ShoppingCart, Bell, Settings } from "lucide-react"
import { checkSession } from "@/service/authService"
import { useNavigate } from "react-router-dom"

// 模拟获取用户数据的函数
const fetchUserData = () => {
  return {
    name: "張三",
    email: "zhangsan@example.com",
    orders: [
      {
        id: 1,
        restaurant: "餐廳A",
        date: "2024-12-01",
        status: "已完成",
      },
      {
        id: 2,
        restaurant: "餐廳B",
        date: "2024-12-05",
        status: "待處理",
      },
    ],
    notifications: [
      { id: 1, message: "您的訂單在餐廳A已確認" },
      { id: 2, message: "餐廳B有新的優惠活動" },
    ],
  }
}

function UserDashboard() {
  const [userData, setUserData] = useState(null)
  const [editData, setEditData] = useState({ name: "", email: "" })
  const [activeTab, setActiveTab] = useState("profile")
  const navigate = useNavigate();

  useEffect(() => {
    const data = fetchUserData()
    setUserData(data)
    setEditData({ name: data.name, email: data.email })
  }, [])

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const apiResponse = await checkSession(); // 使用判斷是否已登入服務方法
        if (apiResponse.message === "用戶已登入") {
          if (apiResponse.data.role === "BUSINESS_USER") {
            alert("請先登出後，改用企業帳號登入!");
            navigate('/');
          }
        } 
      } catch (error) {
        console.error("無法檢查登入狀態:", error);
        alert("使用者未登入，請先登入以進行操作!");
        navigate('/login');
      }
    };

    checkLoginStatus();
  }, []);

  const handleSaveProfile = () => {
    setUserData(prev => ({
      ...prev,
      name: editData.name,
      email: editData.email
    }))
  }

  const renderContent = () => {
    switch(activeTab) {
      case "profile":
        return (
          <Card className="bg-white text-black shadow-lg hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle>個人資料管理</CardTitle>
              <CardDescription>查看和編輯您的個人資訊</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>姓名</Label>
                  <Input 
                    value={editData.name} 
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))} 
                    className="bg-gray-100 text-black border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 p-3"
                  />
                </div>
                <div>
                  <Label>電子郵件</Label>
                  <Input 
                    value={editData.email} 
                    onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))} 
                    className="bg-gray-100 text-black border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 p-3"
                  />
                </div>
                <Button 
                  onClick={handleSaveProfile} 
                  className="w-[100px] bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-600"
                >
                  儲存變更
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      case "orders":
        return (
          <Card className="bg-white text-black shadow-lg hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle>訂單管理</CardTitle>
              <CardDescription>查看您的歷史訂單</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded shadow-sm bg-white">
                <div className="grid grid-cols-4 bg-gray-200 p-2 font-bold border-b text-gray-700">
                  <div>訂單編號</div>
                  <div>餐廳</div>
                  <div>日期</div>
                  <div>狀態</div>
                </div>
                {userData.orders.map((order) => (
                  <div 
                    key={order.id} 
                    className="grid grid-cols-4 p-2 border-b last:border-b-0 hover:bg-gray-100 transition-all duration-200"
                  >
                    <div>{order.id}</div>
                    <div>{order.restaurant}</div>
                    <div>{order.date}</div>
                    <div>{order.status}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      case "notifications":
        return (
          <Card className="bg-white text-black shadow-lg hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle>通知</CardTitle>
              <CardDescription>您的最新消息</CardDescription>
            </CardHeader>
            <CardContent>
              {userData.notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className="p-3 border-b last:border-b-0 hover:bg-gray-100 transition-all duration-200"
                >
                  {notification.message}
                </div>
              ))}
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  if (!userData) return <div>載入中...</div>

  return (
    <div className="flex h-screen bg-gray-900">
      {/* 側邊欄 */}
      <div className="w-64 border-r bg-gray-800 p-4">
        <div className="space-y-4">
          <button 
            className={`flex items-center space-x-3 p-3 w-full text-left rounded-lg ${activeTab === "profile" ? "bg-blue-600" : "hover:bg-gray-600"}`}
            onClick={() => setActiveTab("profile")}
          >
            <User className="h-5 w-5 text-gray-300" />
            <span className="text-gray-300">個人資料</span>
          </button>
          <button 
            className={`flex items-center space-x-3 p-3 w-full text-left rounded-lg ${activeTab === "orders" ? "bg-blue-600" : "hover:bg-gray-600"}`}
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingCart className="h-5 w-5 text-gray-300" />
            <span className="text-gray-300">訂單資訊</span>
          </button>
          <button 
            className={`flex items-center space-x-3 p-3 w-full text-left rounded-lg ${activeTab === "notifications" ? "bg-blue-600" : "hover:bg-gray-600"}`}
            onClick={() => setActiveTab("notifications")}
          >
            <Bell className="h-5 w-5 text-gray-300" />
            <span className="text-gray-300">通知</span>
          </button>
          <button 
            className={`flex items-center space-x-3 p-3 w-full text-left rounded-lg ${activeTab === "settings" ? "bg-blue-600" : "hover:bg-gray-600"}`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="h-5 w-5 text-gray-300" />
            <span className="text-gray-300">設置</span>
          </button>
        </div>
      </div>

      {/* 主內容區 */}
      <div className="flex-1 p-8 bg-gray-50">
        {renderContent()}
      </div>
    </div>
  )
}

export default UserDashboard
