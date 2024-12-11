import React, { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { 
  Home, 
  CalendarCheck, 
  MenuSquare, 
  Images, 
  Settings,
  User,
  PlusCircle,
  Trash2,
  Edit
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function BusinessDashboard() {
  const [activeTab, setActiveTab] = useState("restaurants")
  const [restaurants, setRestaurants] = useState([
    {
      id: "1",
      name: "餐廳A",
      address: "台北市信義區",
      introduction: "美味的地方",
      hours: {
        morning: "07:00-11:00",
        evening: "17:00-22:00"
      },
      reservationDates: []
    },
    {
      id: "2", 
      name: "餐廳B", 
      address: "台北市大安區",
      introduction: "精緻料理",
      hours: {
        morning: "08:00-12:00",
        evening: "18:00-23:00"
      },
      reservationDates: []
    }
  ])
  const [accountInfo, setAccountInfo] = useState({
    username: "business_user",
    email: "business@example.com",
    phone: "0912345678"
  })
  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    address: "",
    introduction: "",
    hours: {
      morning: "",
      evening: ""
    },
    reservationDates: []
  })
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [selectedDates, setSelectedDates] = useState([])

  const handleDeleteRestaurant = (id) => {
    setRestaurants(prev => prev.filter(restaurant => restaurant.id !== id))
  }

  const handleEditRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant)
  }

  const handleSaveRestaurant = () => {
    if (selectedRestaurant) {
      setRestaurants(prev => 
        prev.map(r => r.id === selectedRestaurant.id ? selectedRestaurant : r)
      )
      setSelectedRestaurant(null)
    }
  }

  const handleCreateNewRestaurant = () => {
    const newId = (restaurants.length + 1).toString()
    setRestaurants(prev => [...prev, {
      ...newRestaurant,
      id: newId,
      reservationDates: selectedDates
    }])
    
    // Reset form
    setNewRestaurant({
      name: "",
      address: "",
      introduction: "",
      hours: { morning: "", evening: "" },
    })
    setSelectedDates([])
  }

  const renderContent = () => {
    switch(activeTab) {
      case "restaurants":
        return (
          <Card>
            <CardHeader>
              <CardTitle>餐廳管理</CardTitle>
              <CardDescription>查看和管理您的餐廳</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {restaurants.map((restaurant) => (
                  <div 
                    key={restaurant.id} 
                    className="border p-4 rounded flex justify-between items-center hover:bg-gray-50"
                  >
                    <div>
                      <div className="font-bold text-lg">{restaurant.name}</div>
                      <div className="text-sm text-gray-600">{restaurant.address}</div>
                      <div className="text-sm">{restaurant.introduction}</div>
                      <div className="text-sm">
                        早班: {restaurant.hours.morning} | 晚班: {restaurant.hours.evening}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditRestaurant(restaurant)}
                      >
                        <Edit className="mr-2 h-4 w-4" /> 編輯
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeleteRestaurant(restaurant.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> 刪除
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )

      case "new-restaurant":
        return (
          <Card>
            <CardHeader>
              <CardTitle>新增餐廳</CardTitle>
              <CardDescription>建立您的新餐廳</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>餐廳名稱</Label>
                  <Input 
                    value={newRestaurant.name}
                    onChange={(e) => setNewRestaurant(prev => ({...prev, name: e.target.value}))}
                  />
                </div>
                <div>
                  <Label>餐廳地址</Label>
                  <Input 
                    value={newRestaurant.address}
                    onChange={(e) => setNewRestaurant(prev => ({...prev, address: e.target.value}))}
                  />
                </div>
                <div>
                  <Label>餐廳介紹</Label>
                  <Textarea 
                    value={newRestaurant.introduction}
                    onChange={(e) => setNewRestaurant(prev => ({...prev, introduction: e.target.value}))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>早班營業時間</Label>
                    <Input 
                      placeholder="例如: 07:00-11:00"
                      value={newRestaurant.hours.morning}
                      onChange={(e) => setNewRestaurant(prev => ({
                        ...prev, 
                        hours: {...prev.hours, morning: e.target.value}
                      }))}
                    />
                  </div>
                  <div>
                    <Label>晚班營業時間</Label>
                    <Input 
                      placeholder="例如: 17:00-22:00"
                      value={newRestaurant.hours.evening}
                      onChange={(e) => setNewRestaurant(prev => ({
                        ...prev, 
                        hours: {...prev.hours, evening: e.target.value}
                      }))}
                    />
                  </div>
                </div>
                <div>
                  <Label>可預約日期</Label>
                  <Calendar
                    mode="multiple"
                    selected={selectedDates}
                    onSelect={setSelectedDates}
                    className="rounded-md border"
                  />
                </div>
                <Button onClick={handleCreateNewRestaurant}>
                  <PlusCircle className="mr-2 h-4 w-4" /> 建立餐廳
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case "account":
        return (
          <Card>
            <CardHeader>
              <CardTitle>帳號管理</CardTitle>
              <CardDescription>管理您的企業帳號資訊</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>使用者名稱</Label>
                  <Input 
                    value={accountInfo.username}
                    onChange={(e) => setAccountInfo(prev => ({...prev, username: e.target.value}))}
                  />
                </div>
                <div>
                  <Label>電子郵件</Label>
                  <Input 
                    value={accountInfo.email}
                    onChange={(e) => setAccountInfo(prev => ({...prev, email: e.target.value}))}
                  />
                </div>
                <div>
                  <Label>聯絡電話</Label>
                  <Input 
                    value={accountInfo.phone}
                    onChange={(e) => setAccountInfo(prev => ({...prev, phone: e.target.value}))}
                  />
                </div>
                <Button>儲存變更</Button>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  // 編輯餐廳的彈出視窗
  const renderEditRestaurantModal = () => {
    if (!selectedRestaurant) return null

    return (
      <Dialog open={!!selectedRestaurant} onOpenChange={() => setSelectedRestaurant(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>編輯餐廳</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>餐廳名稱</Label>
              <Input 
                value={selectedRestaurant.name}
                onChange={(e) => setSelectedRestaurant(prev => ({...prev, name: e.target.value}))}
              />
            </div>
            <div>
              <Label>餐廳地址</Label>
              <Input 
                value={selectedRestaurant.address}
                onChange={(e) => setSelectedRestaurant(prev => ({...prev, address: e.target.value}))}
              />
            </div>
            <div>
              <Label>餐廳介紹</Label>
              <Textarea 
                value={selectedRestaurant.introduction}
                onChange={(e) => setSelectedRestaurant(prev => ({...prev, introduction: e.target.value}))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>早班營業時間</Label>
                <Input 
                  value={selectedRestaurant.hours.morning}
                  onChange={(e) => setSelectedRestaurant(prev => ({
                    ...prev, 
                    hours: {...prev.hours, morning: e.target.value}
                  }))}
                />
              </div>
              <div>
                <Label>晚班營業時間</Label>
                <Input 
                  value={selectedRestaurant.hours.evening}
                  onChange={(e) => setSelectedRestaurant(prev => ({
                    ...prev, 
                    hours: {...prev.hours, evening: e.target.value}
                  }))}
                />
              </div>
            </div>
            <Button onClick={handleSaveRestaurant}>儲存變更</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="flex h-screen">
      {/* 側邊欄 */}
      <div className="w-64 border-r bg-gray-50 p-4">
        <div className="space-y-2">
          <button 
            className={`flex items-center space-x-2 p-2 w-full text-left rounded ${activeTab === "restaurants" ? "bg-gray-200" : "hover:bg-gray-100"}`}
            onClick={() => setActiveTab("restaurants")}
          >
            <Home className="h-5 w-5" />
            <span>餐廳管理</span>
          </button>
          <button 
            className={`flex items-center space-x-2 p-2 w-full text-left rounded ${activeTab === "new-restaurant" ? "bg-gray-200" : "hover:bg-gray-100"}`}
            onClick={() => setActiveTab("new-restaurant")}
          >
            <PlusCircle className="h-5 w-5" />
            <span>新增餐廳</span>
          </button>
          <button 
            className={`flex items-center space-x-2 p-2 w-full text-left rounded ${activeTab === "account" ? "bg-gray-200" : "hover:bg-gray-100"}`}
            onClick={() => setActiveTab("account")}
          >
            <User className="h-5 w-5" />
            <span>帳號管理</span>
          </button>
        </div>
      </div>

      {/* 主內容區 */}
      <div className="flex-1 p-8 overflow-auto">
        {renderContent()}
      </div>

      {/* 編輯餐廳彈出視窗 */}
      {renderEditRestaurantModal()}
    </div>
  )
}

export default BusinessDashboard
