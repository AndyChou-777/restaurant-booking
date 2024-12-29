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
import { getUserReservations, getAvailabilities, updateReservation, cancelReservation } from "@/service/reservationService"
import { Calendar } from "@/components/ui/calendar";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllAvailabilities } from "@/service/availabilityService"

function UserDashboard() {
  const [userData, setUserData] = useState(null)
  const [editData, setEditData] = useState({ name: "", email: "" })
  const [activeTab, setActiveTab] = useState("orders")
  const navigate = useNavigate();
  const [selectedReservation, setSelectedReservation] = useState(null);

  useEffect(() => {

    const fetchUserReservations = async () => {
      try {
        const apiResponse = await getUserReservations()
        console.log(apiResponse);
        setUserData(apiResponse);
      } catch (error) {
        console.error("預約資料讀取錯誤:", error);
      }
    }
    
    fetchUserReservations();
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
                      <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 border-blue-200 hover:bg-blue-50"
                          onClick={() => setSelectedReservation(reservation)}
                        >
                          編輯
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg bg-white">
                        <DialogHeader>
                          <DialogTitle>修改預約</DialogTitle>
                        </DialogHeader>
                        <EditBookingForm 
                          booking={reservation}
                        />
                      </DialogContent>
                    </Dialog>
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
      case "notifications":
        return (
          <Card className="bg-white text-black shadow-lg hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle>通知</CardTitle>
              <CardDescription>您的最新消息</CardDescription>
            </CardHeader>
            <CardContent>
             
                <div className="p-3 border-b last:border-b-0 hover:bg-gray-100 transition-all duration-200">
                  留白
                </div>
            
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
            <span className="text-gray-300">預約資訊</span>
          </button>
          <button 
            className={`flex items-center space-x-3 p-3 w-full text-left rounded-lg ${activeTab === "notifications" ? "bg-blue-600" : "hover:bg-gray-600"}`}
            onClick={() => setActiveTab("notifications")}
          >
            <Bell className="h-5 w-5 text-gray-300" />
            <span className="text-gray-300">通知</span>
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

const EditBookingForm = ({ booking, onSubmit, onCancel }) => {
  const [selectedDate, setSelectedDate] = useState(booking?.date ? new Date(booking.date) : null);
  const [selectedTime, setSelectedTime] = useState(booking?.time || '');
  const [availableDateRanges, setAvailableDateRanges] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [guests, setGuests] = useState(booking?.numberOfPeople || 1);
  const [isLoading, setIsLoading] = useState(false);

  // 在組件載入時獲取可用日期範圍
  useEffect(() => {
    const fetchAvailableDates = async () => {
      setIsLoading(true);
      try {
        const apiResponse = await getAllAvailabilities(booking.restaurantId);

        if (apiResponse.status === 200 && apiResponse.data) {
          const ranges = apiResponse.data.map(range => ({
            startDate: new Date(range.startDate),
            endDate: new Date(range.endDate),
            startTime: range.startTime,
            endTime: range.endTime
          }));
          setAvailableDateRanges(ranges);
          console.log('Parsed date ranges:', ranges);
        }
      } catch (error) {
        console.error('獲取可用日期失敗:', error);
      }
      setIsLoading(false);
    };

    fetchAvailableDates();
  }, [booking.restaurantId]);

  // 當選擇日期時獲取可用時段
  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (!selectedDate) return;
      
      setIsLoading(true);
      try {
        const formattedDate = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000))
          .toISOString()
          .split('T')[0];
        const data = await getAvailabilities(booking.restaurantId, formattedDate);

        if (data.status === 200 && data.data) {
          const slots = data.data.map(time => ({
            time: time,
            disabled: false
          }));
          setAvailableTimeSlots(slots);
          // 重置選擇的時間
          setSelectedTime('');
        } else {
          setAvailableTimeSlots([]);
        }
      } catch (error) {
        console.error('獲取可用時段失敗:', error);
        setAvailableTimeSlots([]);
      }
      setIsLoading(false);
    };

    fetchAvailableTimes();
  }, [selectedDate, booking.restaurantId]);

  // 檢查日期是否在可用範圍內
  const isDateInRange = (date) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    if (checkDate < currentDate) {
      return false;
    }

    return availableDateRanges.some(range => {
      const startDate = new Date(range.startDate);
      const endDate = new Date(range.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      return checkDate >= startDate && checkDate <= endDate;
    });
  };

  const handleBooking = async (e) => {
    e.preventDefault(); // 阻止表單默認提交行為
    
    if (!selectedDate || !selectedTime) return;
    
    setIsLoading(true);
    try {
      // 處理日期時區問題
      const formattedDate = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000))
        .toISOString()
        .split('T')[0];
  
      const reservationData = {
        restaurantId: booking.restaurantId,
        reservationDate: formattedDate,
        reservationTime: selectedTime,
        numberOfPeople: guests,
      };
  
      console.log('Sending reservation data:', reservationData);
      console.log('Sending reservation Id:', booking.id);

      const apiResponse = await updateReservation(booking.id, reservationData);
      
      if (apiResponse.status === 200) {
        alert('預約更新成功！');
        // 關閉對話框
        const closeButton = document.querySelector('[data-dialog-close]');
        if (closeButton) {
          closeButton.click();
        }
        // 重新載入預約資料
        window.location.reload();
      }
    } catch (error) {
      console.error('預約失敗:', error);
      alert('預約更新失敗，請稍後再試。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleBooking} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium">選擇日期</label>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
          disabled={(date) => !isDateInRange(date)}
          fromDate={new Date()}
          toDate={availableDateRanges.reduce((maxDate, range) => {
            const endDate = new Date(range.endDate);
            return endDate > maxDate ? endDate : maxDate;
          }, new Date())} 
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">選擇時間</label>
        <Select 
          value={selectedTime} 
          onValueChange={setSelectedTime}
          disabled={!selectedDate || isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder={isLoading ? "載入中..." : "請選擇時段"} />
          </SelectTrigger>
          <SelectContent>
            {availableTimeSlots.map(slot => (
              <SelectItem key={slot.time} value={slot.time}>
                {slot.time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">用餐人數</label>
        <Select 
          value={guests.toString()} 
          onValueChange={(value) => setGuests(parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="選擇人數" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num} 人
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">預約確認訊息</h3>
        <p className="text-sm text-gray-500">
          {selectedDate && selectedTime ? (
            <>
              您選擇的預約時間是 {selectedDate.toLocaleDateString()} {selectedTime}，
              用餐人數 {guests} 人
            </>
          ) : (
            '請選擇預約日期和時間'
          )}
        </p>
      </div>

      <div className="flex justify-end space-x-2">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            取消
          </Button>
        </DialogClose>
        <Button 
          type="submit"
          disabled={!selectedDate || !selectedTime || isLoading}
        >
          {isLoading ? '更新中...' : '確認修改'}
        </Button>
      </div>
    </form>
  );
};

export default UserDashboard
