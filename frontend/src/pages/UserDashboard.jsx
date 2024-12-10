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

  useEffect(() => {
    const data = fetchUserData()
    setUserData(data)
    setEditData({ name: data.name, email: data.email })
  }, [])

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
          <Card>
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
                  />
                </div>
                <div>
                  <Label>電子郵件</Label>
                  <Input 
                    value={editData.email} 
                    onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))} 
                  />
                </div>
                <Button onClick={handleSaveProfile}>儲存變更</Button>
              </div>
            </CardContent>
          </Card>
        )
      case "orders":
        return (
          <Card>
            <CardHeader>
              <CardTitle>訂單管理</CardTitle>
              <CardDescription>查看您的歷史訂單</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded">
                <div className="grid grid-cols-4 bg-gray-100 p-2 font-bold border-b">
                  <div>訂單編號</div>
                  <div>餐廳</div>
                  <div>日期</div>
                  <div>狀態</div>
                </div>
                {userData.orders.map((order) => (
                  <div 
                    key={order.id} 
                    className="grid grid-cols-4 p-2 border-b last:border-b-0 hover:bg-gray-50"
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
          <Card>
            <CardHeader>
              <CardTitle>通知</CardTitle>
              <CardDescription>您的最新消息</CardDescription>
            </CardHeader>
            <CardContent>
              {userData.notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className="p-3 border-b last:border-b-0 hover:bg-gray-50"
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
    <div className="flex h-screen">
      {/* 側邊欄 */}
      <div className="w-64 border-r bg-gray-50 p-4">
        <div className="space-y-2">
          <button 
            className={`flex items-center space-x-2 p-2 w-full text-left rounded ${activeTab === "profile" ? "bg-gray-200" : "hover:bg-gray-100"}`}
            onClick={() => setActiveTab("profile")}
          >
            <User className="h-5 w-5" />
            <span>個人資料</span>
          </button>
          <button 
            className={`flex items-center space-x-2 p-2 w-full text-left rounded ${activeTab === "orders" ? "bg-gray-200" : "hover:bg-gray-100"}`}
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingCart className="h-5 w-5" />
            <span>訂單資訊</span>
          </button>
          <button 
            className={`flex items-center space-x-2 p-2 w-full text-left rounded ${activeTab === "notifications" ? "bg-gray-200" : "hover:bg-gray-100"}`}
            onClick={() => setActiveTab("notifications")}
          >
            <Bell className="h-5 w-5" />
            <span>通知</span>
          </button>
          <button 
            className={`flex items-center space-x-2 p-2 w-full text-left rounded ${activeTab === "settings" ? "bg-gray-200" : "hover:bg-gray-100"}`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="h-5 w-5" />
            <span>設置</span>
          </button>
        </div>
      </div>

      {/* 主內容區 */}
      <div className="flex-1 p-8 overflow-auto">
        {renderContent()}
      </div>
    </div>
  )
}

export default UserDashboard
