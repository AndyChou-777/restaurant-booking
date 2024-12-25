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
import { AlertCircle } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { useNavigate } from "react-router-dom"
import { checkSession } from "@/service/authService"
import { 
  createRestaurant, 
  updateRestaurant, 
  deleteRestaurant,
  searchRestaurants 
} from "@/service/restaurantService"
import { X } from "lucide-react"

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
    name: "", // 餐廳名稱
    address: "", // 餐廳地址
    description: "", // 餐廳描述
    averageSpending: "", // 平均消費金額
    imageBase64List: [], // 圖片的 Base64 編碼列表
    tags: [], // 餐廳標籤
    startDate: "", // 開始日期 (YYYY-MM-DD)
    endDate: "", // 結束日期 (YYYY-MM-DD)
    startTime: "", // 營業開始時間 (HH:mm)
    endTime: "" // 營業結束時間 (HH:mm)
  });

  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState(null);
  const [alertDescription, setAlertDescription] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
      const checkLoginStatus = async () => {
        try {
          const apiResponse = await checkSession(); // 使用判斷是否已登入服務方法
          if (apiResponse.message === "登入成功") {
            if (apiResponse.data.role === "GENERAL_USER") {
              alert("身分別錯誤，請改用一般帳號登入!");
              navigate('/login');
            }
          } else {
            alert("用戶未登入，請先進行登入!");
            navigate('/login');
          }
        } catch (error) {
          console.error("無法檢查登入狀態:", error);
          alert("使用者未登入，請先登入以進行操作!");
          navigate('/');
        }
      };
  
      checkLoginStatus();
    }, []);

  const showTemporaryAlert = (title, description) => {
    
    setAlertTitle(title);
    setAlertDescription(description);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 3000); 
  };

  const handleDeleteRestaurant = (id) => {
    setRestaurants(prev => prev.filter(restaurant => restaurant.id !== id))
    showTemporaryAlert('刪除成功', '餐廳資料已成功刪除')
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

    showTemporaryAlert('修改成功!', '餐廳資料已成功更新');

  }

  const handleCreateNewRestaurant = async () => {
    try {
        const apiResponse = await createRestaurant(newRestaurant);
        if (apiResponse.message === '餐廳建立成功') {
          showTemporaryAlert('成功', '餐廳創建成功！');

           // 清空表單，將各個欄位重設為初始狀態
          setNewRestaurant({
            name: "", 
            address: "",
            description: "",
            averageSpending: "",
            imageBase64List: [],
            tags: [],
            startDate: "",
            endDate: "",
            startTime: "",
            endTime: ""
          });

          setActiveTab('restaurants');
        }

    } catch (error) {
        console.error('Error details:', error); // 添加詳細錯誤日誌
        showTemporaryAlert('錯誤', error.message);
    }
};

  const renderContent = () => {
    switch(activeTab) {
      case "restaurants":
        return (
          <Card className="bg-white text-black shadow-lg hover:shadow-2xl transition-all duration-300">
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
                        className="rounded-[8px]"
                      >
                        <Edit className="mr-2 h-4 w-4" /> 編輯
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeleteRestaurant(restaurant.id)}
                        className="border border-black rounded-[8px]"
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
            <Card className="bg-white text-black shadow-lg hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle>新增餐廳</CardTitle>
                <CardDescription>建立您的新餐廳</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* 餐廳名稱 */}
                  <div>
                    <Label>餐廳名稱</Label>
                    <Input
                      value={newRestaurant.name}
                      onChange={(e) => setNewRestaurant(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
        
                  {/* 餐廳地址 */}
                  <div>
                    <Label>餐廳地址</Label>
                    <Input
                      value={newRestaurant.address}
                      onChange={(e) => setNewRestaurant(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
        
                  {/* 餐廳描述 */}
                  <div>
                    <Label>餐廳描述</Label>
                    <Textarea
                      value={newRestaurant.description}
                      onChange={(e) => setNewRestaurant(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
        
                  {/* 平均消費金額 */}
                  <div>
                    <Label>平均消費金額</Label>
                    <Input
                      type="number"
                      value={newRestaurant.averageSpending}
                      onChange={(e) => setNewRestaurant(prev => ({ ...prev, averageSpending: e.target.value }))}
                    />
                  </div>
        
                  {/* 營業日期 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>開始日期</Label>
                      <Input
                        type="date"
                        value={newRestaurant.startDate}
                        onChange={(e) => setNewRestaurant(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>結束日期</Label>
                      <Input
                        type="date"
                        value={newRestaurant.endDate}
                        onChange={(e) => setNewRestaurant(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                  </div>
        
                  {/* 營業時間 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>營業開始時間</Label>
                      <Input
                        type="time"
                        value={newRestaurant.startTime}
                        onChange={(e) => setNewRestaurant(prev => ({ ...prev, startTime: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>營業結束時間</Label>
                      <Input
                        type="time"
                        value={newRestaurant.endTime}
                        onChange={(e) => setNewRestaurant(prev => ({ ...prev, endTime: e.target.value }))}
                      />
                    </div>
                  </div>
        
                  {/* 餐廳標籤 */}
                  <div>
                    <Label>餐廳標籤</Label>
                    <Input
                      placeholder="請輸入標籤（以逗號分隔）"
                      value={newRestaurant.tags.join(", ")}
                      onChange={(e) =>
                        setNewRestaurant(prev => ({
                          ...prev,
                          tags: e.target.value.split(",").map(tag => tag.trim())
                        }))
                      }
                    />
                  </div>
        
                  <div>
                    <Label>餐廳圖片</Label>
                    <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          id="file-upload"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            
                            if (files.length + newRestaurant.imageBase64List.length > 4) {
                              alert("最多只能上傳 4 張圖片！");
                              return;
                            }
                            
                            const readers = files.map(file => {
                              const reader = new FileReader();
                              reader.readAsDataURL(file);
                              return new Promise(resolve => {
                                reader.onload = () => resolve(reader.result);
                              });
                            });

                            Promise.all(readers).then(images => {
                              setNewRestaurant(prev => ({
                                ...prev,
                                imageBase64List: [...prev.imageBase64List, ...images]
                              }));
                            });
                          }}
                        />
                        <label
                          htmlFor="file-upload"
                          className="inline-flex cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                        >
                          選擇檔案
                        </label>
                        <span className="ml-4 text-black">
                          {newRestaurant.imageBase64List.length 
                            ? `已選擇 ${newRestaurant.imageBase64List.length} 個檔案` 
                            : '尚未選擇檔案'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 預覽圖片 */}
                  <div className="mt-4">
                    <Label>預覽圖片</Label>
                    <div className="flex gap-4">
                      {newRestaurant.imageBase64List.map((image, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={image} 
                            alt={`preview-${index}`} 
                            className="w-32 h-32 object-cover rounded-md" 
                          />
                          {/* 顯示刪除按鈕 */}
                          <button
                            type="button"
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors"
                            onClick={() => {
                              setNewRestaurant(prev => ({
                                ...prev,
                                imageBase64List: prev.imageBase64List.filter((_, idx) => idx !== index)
                              }));
                            }}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
        
                  {/* 提交按鈕 */}
                  <Button
                    onClick={handleCreateNewRestaurant}
                    className="border border-black rounded-[8px]"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> 建立餐廳
                  </Button>
                </div>
              </CardContent>
            </Card>
          );

      case "account":
        return (
          <Card className="bg-white text-black shadow-lg hover:shadow-2xl transition-all duration-300">
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
                <Button className="bg-blue-500 text-white font-bold shadow-md hover:bg-blue-600 rounded-[8px]"
                        onClick = { () => showTemporaryAlert('資料變更成功!', '餐廳基本資料已變更')}
                >
                  儲存變更
                </Button>
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
        <DialogContent className="bg-white">
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
              <Button onClick={handleSaveRestaurant}
                      className="bg-blue-500 text-white font-bold shadow-md hover:bg-blue-600 rounded-[8px]"
              >
                儲存變更
              </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="flex h-screen">

      {/* Alert 控制區塊 */}

      {showAlert && (
      <Alert className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black border border-black p-4 shadow-lg z-50 w-[500px] rounded-[8px]">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className='font-bold'>{alertTitle}</AlertTitle>
      <AlertDescription>
        {alertDescription}
      </AlertDescription>
      </Alert>
      )}

      {/* 側邊欄 */}
      <div className="w-64 border-r bg-gray-800 p-4">
        <div className="space-y-4">
          <button 
            className={`flex items-center space-x-3 p-3 w-full text-left rounded-lg ${activeTab === "restaurants" ? "bg-blue-600" : "hover:bg-gray-600"}`}
            onClick={() => setActiveTab("restaurants")}
          >
            <Home className="h-5 w-5 text-gray-300" />
            <span className="text-gray-300">餐廳管理</span>
          </button>
          <button 
            className={`flex items-center space-x-3 p-3 w-full text-left rounded-lg ${activeTab === "new-restaurant" ? "bg-blue-600" : "hover:bg-gray-600"}`}
            onClick={() => setActiveTab("new-restaurant")}
          >
            <PlusCircle className="h-5 w-5 text-gray-300" />
            <span className="text-gray-300">新增餐廳</span>
          </button>
          <button 
            className={`flex items-center space-x-3 p-3 w-full text-left rounded-lg ${activeTab === "account" ? "bg-blue-600" : "hover:bg-gray-600"}`}
            onClick={() => setActiveTab("account")}
          >
            <User className="h-5 w-5 text-gray-300" />
            <span className="text-gray-300">帳號管理</span>
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
