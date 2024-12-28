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
        if (apiResponse.message === "登入成功") {
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
                <CardTitle>預約管理</CardTitle>
                <CardDescription>管理您的餐廳預約記錄</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-white overflow-hidden">
                  {/* 表頭 */}
                  <div className="grid grid-cols-7 bg-gray-100 p-3 font-semibold text-gray-700 border-b">
                    <div className="col-span-1">預約編號</div>
                    <div className="col-span-1">餐廳名稱</div>
                    <div className="col-span-1">預約時間</div>
                    <div className="col-span-2">地址</div>
                    <div className="col-span-1">狀態</div>
                    <div className="col-span-1 text-center">操作</div>
                  </div>
                  
                  {/* 預約列表 */}
                  {userData.orders.map((order) => (
                    <div 
                      key={order.id}
                      className="grid grid-cols-7 p-4 border-b last:border-b-0 hover:bg-gray-50 transition-all duration-200 items-center"
                    >
                      <div className="col-span-1 font-medium text-gray-900">
                        #{order.id}
                      </div>
                      <div className="col-span-1 text-gray-800">
                        {order.restaurant}
                      </div>
                      <div className="col-span-1 text-gray-800">
                        {order.date}
                      </div>
                      <div className="col-span-2 text-gray-600">
                        台北市信義區松仁路100號
                      </div>
                      <div className="col-span-1">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium
                          ${order.status === '已完成' ? 'bg-green-100 text-green-800' : 
                            order.status === '待處理' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="col-span-1 flex justify-center space-x-2">
                        <Button 
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 border-blue-200 hover:bg-blue-50"
                          onClick={() => alert(`編輯預約 ${order.id}`)}
                        >
                          編輯
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                          onClick={() => {
                            if (window.confirm('確定要取消此預約嗎？')) {
                              alert(`取消預約 ${order.id}`)
                            }
                          }}
                        >
                          取消
                        </Button>
                      </div>
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
