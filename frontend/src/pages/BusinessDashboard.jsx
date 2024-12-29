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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
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
import {
  NotepadText,
  X,
  Save } from "lucide-react"
import { fetchRestaurants } from "@/service/restaurantService"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getBusinessReservations, cancelReservation, finishReservation } from "@/service/reservationService"

function BusinessDashboard() {
  const [activeTab, setActiveTab] = useState("restaurants");
  const [restaurants, setRestaurants] = useState([]);
  const [userData, setUserData] = useState(null)
  const [accountInfo, setAccountInfo] = useState({
    username: "business_user",
    email: "business@example.com",
    phone: "0912345678"
  })
  const [timeSlot, setTimeSlot] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  });
  const [newRestaurant, setNewRestaurant] = useState({
    name: "", // 餐廳名稱
    address: "", // 餐廳地址
    description: "", // 餐廳描述
    averageSpending: "", // 平均消費金額
    imageBase64List: [], // 圖片的 Base64 編碼列表
    tags: [], // 餐廳標籤
    timeSlots: [], // 可預約的多個時間段 (每個元素包含 startDate, endDate, startTime, endTime)
  });

  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState(null);
  const [alertDescription, setAlertDescription] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
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

    useEffect(() => {
    
        const fetchUserReservations = async () => {
          try {
            const apiResponse = await getBusinessReservations()
            console.log('讀取餐廳預約資料: ', apiResponse);
            setUserData(apiResponse);
          } catch (error) {
            console.error("預約資料讀取錯誤:", error);
          }
        }
        
        fetchUserReservations();
      }, [])

    useEffect(() => {
      const loadRestaurants = async () => {
        try {
          const apiResponse = await fetchRestaurants();
          if (apiResponse.message === '旗下餐廳獲取成功') {
            setRestaurants(apiResponse.data.map(restaurant => ({
              id: restaurant.id,
              name: restaurant.name,
              address: restaurant.address,
              description: restaurant.description,
              averageSpending: restaurant.averageSpending,
              timeSlots: restaurant.timeSlots && restaurant.timeSlots.length > 0
                ? restaurant.timeSlots.map(slot => ({
                    startDate: slot.startDate,
                    endDate: slot.endDate,
                    startTime: slot.startTime,
                    endTime: slot.endTime
                  }))
                : [], // 沒有時間段時設置為空陣列
              tags: restaurant.tags,
              imageBase64List: restaurant.imageBase64List
            })));
    
            console.log(apiResponse);
          }
        } catch (error) {
          console.error("無法加載餐廳資料:", error);
          showTemporaryAlert('錯誤', '無法加載餐廳資料');
        }
      };
    
      if (activeTab === "restaurants") {
        loadRestaurants();
      }
    }, [activeTab]);

  const showTemporaryAlert = (title, description) => {
    
    setAlertTitle(title);
    setAlertDescription(description);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 3000); 
  };

  const handleDeleteRestaurant = async (id) => {
    try {
      const apiResponse = await deleteRestaurant(id);
      if(apiResponse.message === '餐廳刪除成功') {
        setRestaurants(prev => prev.filter(restaurant => restaurant.id !== id));
        showTemporaryAlert('刪除成功', '餐廳資料已成功刪除')
      }
    } catch (error) {
      console.error('Error details:', error);
      showTemporaryAlert('錯誤', error.message);
    }
  };

  const handleEditRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant)
    console.log(selectedRestaurant);
  }

  const handleSaveRestaurant = async (id, restaurantDate) => {
    if (selectedRestaurant) {
      try {
        const apiResponse = await updateRestaurant(id, restaurantDate);
        if (apiResponse.message === '餐廳更新成功') {
          // 局部更新餐廳列表狀態
          setRestaurants(prev =>
            prev.map(r => (r.id === id ? { ...r, ...restaurantDate } : r))
          );
  
          // 清空選擇的餐廳以關閉對話框
          setSelectedRestaurant(null);
  
          // 顯示成功提示
          showTemporaryAlert('修改成功!', '餐廳資料已成功更新');
        }
      } catch (error) {
        console.error('更新餐廳時出現錯誤:', error);
        showTemporaryAlert('錯誤', '無法更新餐廳，請稍後再試');
      }
    }
  };  

  const handleCancel = async (name, id) => {
      try {
        const apiResponse = await cancelReservation(id);
  
        if (apiResponse.message === '預約取消成功!') {
          alert(`${name} 預約取消成功!`)
          window.location.reload()
        }
      } catch (error) {
        console.error(error.message)
      }
    }

  const handleFinish = async (id) => {
    try {
      const apiResponse = await finishReservation(id);

      if (apiResponse.message === '預約成功報到') {
        alert(`#${id} 預約成功報到!`)
        window.location.reload()
      }
    } catch (error) {
      console.error(error.message)
    }
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
            timeSlots: [],
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
                      <div className="text-sm">{restaurant.description}</div>
                      <div className="text-sm">
                        可供預約時間段:
                        {restaurant.timeSlots && restaurant.timeSlots.length > 0 ? (
                          <div className="mt-2 space-y-1">
                            {restaurant.timeSlots.map((slot, index) => (
                              <div
                                key={index}
                                className="ml-2 text-white bg-blue-400 text-xs px-2 py-1 rounded inline-block"
                              >
                                {slot.startDate} 至 {slot.endDate} | {slot.startTime} ~ {slot.endTime} 
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="ml-2 text-gray-500">無可用時間段</span>
                        )}
                      </div>
                      <div className="text-sm">
                        平均消費: ${restaurant.averageSpending}
                      </div>
                      {restaurant.tags && restaurant.tags.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {restaurant.tags.map((tag, index) => (
                            <span key={index} className="bg-gray-100 text-xs px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {restaurant.imageBase64List && restaurant.imageBase64List.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {restaurant.imageBase64List.slice(0, 2).map((image, index) => (
                            <img 
                              key={index}
                              src={image}
                              alt={`${restaurant.name}-${index}`}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ))}
                          {restaurant.imageBase64List.length > 2 && (
                            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                              +{restaurant.imageBase64List.length - 2}
                            </div>
                          )}
                        </div>
                      )}
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
                      <AlertDialog>
                      <AlertDialogTrigger
                        variant="destructive"
                        size="sm"
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 rounded-[8px]"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> 刪除
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle>刪除餐廳</AlertDialogTitle>
                          <AlertDialogDescription>
                            此操作將永久刪除您的餐廳資料，確定要繼續嗎?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogAction className="bg-blue-500 text-white font-bold shadow-md hover:bg-blue-600 rounded-[8px]" onClick={()=> handleDeleteRestaurant(restaurant.id)}>繼續</AlertDialogAction>
                          <AlertDialogAction className="bg-red-500 text-white font-bold shadow-md hover:bg-red-600 rounded-[8px]">取消</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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

                  {/* 餐廳標籤 */}
                  <div>
                    <Label>餐廳標籤</Label>
                    <Input
                      placeholder="請輸入標籤（以半形逗號分隔）"
                      value={newRestaurant.tags.join(", ")}
                      onChange={(e) =>
                        setNewRestaurant(prev => ({
                          ...prev,
                          tags: e.target.value.split(",").map(tag => tag.trim())
                        }))
                      }
                    />
                  </div>
        
                  {/* 時間段輸入區域 */}
                  <div>
                    <Label>新增可預約時間段</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <Label>開始日期</Label>
                        <Input
                          type="date"
                          value={timeSlot.startDate}
                          onChange={(e) => setTimeSlot({ ...timeSlot, startDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>結束日期</Label>
                        <Input
                          type="date"
                          value={timeSlot.endDate}
                          onChange={(e) => setTimeSlot({ ...timeSlot, endDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>開始時間</Label>
                        <Input
                          type="time"
                          value={timeSlot.startTime}
                          onChange={(e) => setTimeSlot({ ...timeSlot, startTime: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>結束時間</Label>
                        <Input
                          type="time"
                          value={timeSlot.endTime}
                          onChange={(e) => setTimeSlot({ ...timeSlot, endTime: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => {
                        if (
                          timeSlot.startDate &&
                          timeSlot.endDate &&
                          timeSlot.startTime &&
                          timeSlot.endTime
                        ) {
                          // 將新時間段加入到 newRestaurant 的 timeSlots 中
                          setNewRestaurant(prev => ({
                            ...prev,
                            timeSlots: [...prev.timeSlots, timeSlot],
                          }));
                          // 清空 timeSlot 輸入欄位
                          setTimeSlot({ startDate: "", endDate: "", startTime: "", endTime: "" });
                        } else {
                          alert("請完整填寫時間段！");
                        }
                      }}
                      className="mt-2"
                    >
                    新增時間段
                  </Button>
                  </div>
                  
                  <div className="mt-4">
                    <Label>已新增的時間段</Label>
                    <div className="space-y-2">
                      {newRestaurant.timeSlots.map((slot, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center border p-2 rounded bg-gray-50"
                        >
                          <div>
                            {slot.startDate} 至 {slot.endDate} | {slot.startTime} ~ {slot.endTime}
                          </div>
                          <button
                            onClick={() =>
                              setNewRestaurant(prev => ({
                                ...prev,
                                timeSlots: prev.timeSlots.filter((_, i) => i !== index),
                              }))
                            }
                            className="text-red-500 hover:underline"
                          >
                            刪除
                          </button>
                        </div>
                      ))}
                    </div>
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
                    onClick={() => {
                      console.log("要送出的資料:", newRestaurant); // 檢查資料格式
                      handleCreateNewRestaurant(newRestaurant); // 傳遞資料給處理函數
                    }}
                    className="border border-black rounded-[8px]"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> 建立餐廳
                </Button>
                </div>
              </CardContent>
            </Card>
          );

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
                  <div className="grid grid-cols-8 bg-gray-100 p-3 font-semibold text-gray-700 border-b">
                    <div className="col-span-1">餐廳</div>
                    <div className="col-span-2">地址</div>
                    <div className="col-span-1">日期</div>
                    <div className="col-span-1">時間</div>
                    <div className="col-span-1">人數</div>
                    <div className="col-span-1">狀態</div>
                    <div className="col-span-1 text-center">操作</div>
                  </div>
                  
                  {/* 預約列表 */}
                  {userData.data.map((reservation) => (
                    <div 
                    key={reservation.id}
                    className="grid grid-cols-8 p-4 border-b last:border-b-0 hover:bg-gray-50 transition-all duration-200 items-center"
                    >
                      <div className="col-span-1 font-medium text-gray-900">
                        {reservation.name}
                      </div>
                      <div className="col-span-2 text-gray-800">
                        {reservation.address}
                      </div>
                      <div className="col-span-1 text-gray-800">
                        {reservation.reservationDate}
                      </div>
                      <div className="col-span-1 text-gray-600">
                        {reservation.reservationTime}
                      </div>
                      <div className="col-span-1 text-gray-600">
                        {reservation.numberOfPeople} 位
                      </div>
                      <div className="col-span-1">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium
                          ${reservation.status === 'CONFIRMED' ? 'bg-blue-500 text-white' : 
                            reservation.status === 'COMPLETED' ? 'bg-blue-500 text-white' : 
                            reservation.status === 'CANCELLED' ? 'bg-red-500 text-white' : 
                            'bg-gray-100 text-gray-800'}`}
                      >
                        {reservation.status === 'CONFIRMED' && '成功'}
                        {reservation.status === 'COMPLETED' && '完成'}
                        {reservation.status === 'CANCELLED' && '取消'}
                      </span>
                      </div>
                      <div className="col-span-1 flex justify-center space-x-2">
                      <Button 
                      variant="outline"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 border-blue-200 hover:bg-blue-50"
                      onClick={() => {
                        if (window.confirm('確定要完成此筆預約嗎？')) {
                          handleFinish(reservation.id)
                        }
                      }}
                    >
                      完成
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                      onClick={() => {
                        if (window.confirm('確定要取消此預約嗎？')) {
                          handleCancel(reservation.name, reservation.id)
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
    if (!selectedRestaurant) return null;
  
    return (
      <Dialog open={!!selectedRestaurant} onOpenChange={() => setSelectedRestaurant(null)}>
        <DialogContent className="bg-white max-w-3xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>編輯餐廳</DialogTitle>
          </DialogHeader>
          <div key={selectedRestaurant.id} className="overflow-y-auto pr-4 max-h-[calc(90vh-8rem)]">
            {/* 基本資訊 */}
            <div>
              <Label>餐廳名稱</Label>
              <Input 
                value={selectedRestaurant.name}
                onChange={(e) => setSelectedRestaurant(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label>餐廳地址</Label>
              <Input 
                value={selectedRestaurant.address}
                onChange={(e) => setSelectedRestaurant(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>
            <div>
              <Label>餐廳介紹</Label>
              <Textarea 
                value={selectedRestaurant.description}
                onChange={(e) => setSelectedRestaurant(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div>
              <Label>平均消費金額</Label>
              <Input
                type="number"
                value={selectedRestaurant.averageSpending}
                onChange={(e) => setSelectedRestaurant(prev => ({ ...prev, averageSpending: e.target.value }))}
              />
            </div>
            <div>
              <Label>餐廳標籤</Label>
              <Input
                placeholder="請輸入標籤（以半形逗號分隔）"
                value={selectedRestaurant.tags.join(", ")}
                onChange={(e) =>
                  setSelectedRestaurant(prev => ({
                    ...prev,
                    tags: e.target.value.split(",").map(tag => tag.trim())
                  }))
                }
              />
            </div>
            {/* 時間段管理 */}
            <div>
              <Label>可預約時間段</Label>
              <div className="space-y-4">
                {selectedRestaurant.timeSlots.map((slot, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input 
                      type="date"
                      value={slot.startDate}
                      onChange={(e) => {
                        const updatedHours = [...selectedRestaurant.timeSlots];
                        updatedHours[index].startDate = e.target.value;
                        setSelectedRestaurant(prev => ({ ...prev, timeSlots: updatedHours }));
                      }}
                    />
                    <Input 
                      type="date"
                      value={slot.endDate}
                      onChange={(e) => {
                        const updatedHours = [...selectedRestaurant.timeSlots];
                        updatedHours[index].endDate = e.target.value;
                        setSelectedRestaurant(prev => ({ ...prev, timeSlots: updatedHours }));
                      }}
                    />
                    <Input 
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => {
                        const updatedHours = [...selectedRestaurant.timeSlots];
                        updatedHours[index].startTime = e.target.value;
                        setSelectedRestaurant(prev => ({ ...prev, timeSlots: updatedHours }));
                      }}
                    />
                    <Input 
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => {
                        const updatedHours = [...selectedRestaurant.timeSlots];
                        updatedHours[index].endTime = e.target.value;
                        setSelectedRestaurant(prev => ({ ...prev, timeSlots: updatedHours }));
                      }}
                    />
                    <Button 
                      variant="ghost"
                      size="xs"
                      className=" -top-2 -right-2 bg-blue-500 hover:bg-blue-500 text-white rounded-full p-1 shadow-lg transition-colors"
                      onClick={() => {
                        const updatedHours = selectedRestaurant.timeSlots.filter((_, i) => i !== index);
                        setSelectedRestaurant(prev => ({ ...prev, timeSlots: updatedHours }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div >
              <div className="text-right">
              <Button 
                variant="outline" 
                className="bg-blue-500 text-white font-bold hover:bg-blue-600 rounded-[8px] mt-2 mb-2"
                onClick={() => {
                  const newSlot = { startDate: "", endDate: "", startTime: "", endTime: "" };
                  setSelectedRestaurant(prev => ({ ...prev, timeSlots: [...prev.timeSlots, newSlot] }));
                }}
              >
                新增時間
              </Button>
              </div>
            </div>
  
            {/* 圖片管理 */}
          <div>
            <Label>圖片</Label>
            <div className="flex flex-wrap gap-4">
              {selectedRestaurant.imageBase64List.map((image, index) => (
                <div key={index} className="relative">
                  <img 
                    src={image} 
                    alt={`餐廳圖片-${index}`} 
                    className="w-24 h-24 object-cover rounded shadow"
                  />
                  <Button 
                    variant="ghost" 
                    size="xs" 
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors"
                    onClick={() => {
                      const updatedImages = selectedRestaurant.imageBase64List.filter((_, i) => i !== index);
                      setSelectedRestaurant(prev => ({ ...prev, imageBase64List: updatedImages }));
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Input 
                type="file" 
                accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setSelectedRestaurant(prev => ({
                        ...prev,
                        imageBase64List: [...prev.imageBase64List, reader.result],
                      }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
          </div>
  
            {/* 確定保存按鈕 */}
            <div className="text-right">
              <Button 
                onClick={() => {
                  handleSaveRestaurant(selectedRestaurant.id, selectedRestaurant);  // 呼叫 handleSaveRestaurant 函數
                  console.log('輸出結果: ' + JSON.stringify(selectedRestaurant));  // 輸出 selectedRestaurant 到控制台
                }} 
                className="bg-blue-500 text-white font-bold hover:bg-blue-600 rounded-[8px] mt-2 mb-2"
              >
                儲存變更
              </Button>
            </div>
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
            className={`flex items-center space-x-3 p-3 w-full text-left rounded-lg ${activeTab === "orders" ? "bg-blue-600" : "hover:bg-gray-600"}`}
            onClick={() => setActiveTab("orders")}
          >
            <NotepadText className="h-5 w-5 text-gray-300" />
            <span className="text-gray-300">管理預約</span>
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
