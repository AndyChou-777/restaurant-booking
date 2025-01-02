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
import { User, ShoppingCart, Bell, Settings, Store, CalendarCheck, Clock, Users, ClipboardCheck, Edit, Trash2, Utensils, MapPin, Activity, Calendar, Phone, Mail,  } from "lucide-react"
import { checkSession } from "@/service/authService"
import { useNavigate } from "react-router-dom"
import { getUserReservations, getAvailabilities, updateReservation, cancelReservation } from "@/service/reservationService"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllAvailabilities } from "@/service/availabilityService"
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';

function UserDashboard( { showTemporaryAlert } ) {
  const [userData, setUserData] = useState(null)
  const [editData, setEditData] = useState({ name: "", email: "" })
  const [activeTab, setActiveTab] = useState("orders")
  const navigate = useNavigate();
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {

    const fetchUserReservations = async () => {
      try {
        const apiResponse = await getUserReservations();
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
            showTemporaryAlert('身分錯誤', '請先登出後，改用企業帳號登入!', 'error', '/login');
          } else {
            setEditData({
              name: apiResponse.data.username,
              email: apiResponse.data.email,
              phone: '0910-984-374'
            })
          }
        } 
      } catch (error) {
        console.error("無法檢查登入狀態:", error);
        showTemporaryAlert('使用者未登入', '使用者未登入，請先登入以進行操作!', 'error', '/login');
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
        showTemporaryAlert('預約取消', `${name} 預約取消成功!`, 'check')
        setTimeout(() => {
          window.location.reload();
        }, 3000);
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
        <CardTitle className="text-2xl font-bold">個人資料管理</CardTitle>
        <CardDescription>查看和編輯您的個人資訊</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Profile Display */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-white rounded-lg shadow-sm">
                <User className="text-blue-500 w-5 h-5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">姓名</p>
                  <p className="text-lg font-medium">{editData.name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-3 bg-white rounded-lg shadow-sm">
                <Mail className="text-blue-500 w-5 h-5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">電子郵件</p>
                  <p className="text-lg font-medium">{editData.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-3 bg-white rounded-lg shadow-sm">
                <Phone className="text-blue-500 w-5 h-5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">連絡電話</p>
                  <p className="text-lg font-medium">{editData.phone}</p>
                </div>
              </div>
            </div>
          </div>
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
                    <div className="col-span-1 flex"><Utensils className="mr-2 ml-1"/> 餐廳</div>
                    <div className="col-span-2 flex"><MapPin className="mr-2 ml-1"/> 地址</div>
                    <div className="col-span-1 flex"><Calendar className="mr-2"/> 日期</div>
                    <div className="col-span-1 flex"><Clock className="mr-2"/> 時間</div>
                    <div className="col-span-1 flex"><Users className="mr-2"/> 人數</div>
                    <div className="col-span-1 flex"><Activity className="mr-2"/> 狀態</div>
                    <div className="col-span-1 text-center flex"><Settings className="mr-2 ml-6"/> 操作</div>
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
                      <div className="col-span-1 flex justify-center space-x-2 mr-4">
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline"
                          size="sm"
                          className="text-white hover:text-white bg-blue-500 hover:bg-blue-600 rounded-[8px]"
                          onClick={() => setSelectedReservation(reservation)}
                        >
                          <Edit className="mr-2 h-4 w-4" /> 編輯
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg bg-white">
                        <DialogHeader>
                          <DialogTitle>修改預約</DialogTitle>
                        </DialogHeader>
                        <EditBookingForm 
                          booking={reservation}
                          showTemporaryAlert={showTemporaryAlert}
                          setIsDialogOpen={setIsDialogOpen}
                        />
                      </DialogContent>
                    </Dialog>
                    <AlertDialog>
                      <AlertDialogTrigger
                        variant="destructive"
                        size="sm"
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 rounded-[8px] text-white hover:text-white bg-red-500 hover:bg-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> 刪除
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle>取消預約</AlertDialogTitle>
                          <AlertDialogDescription>
                            您確定要刪除該筆預約資料嗎?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogAction className="bg-blue-500 text-white font-bold shadow-md hover:bg-blue-600 rounded-[8px]" onClick={()=> handleCancel(reservation.name, reservation.id)}>繼續</AlertDialogAction>
                          <AlertDialogAction className="bg-red-500 text-white font-bold shadow-md hover:bg-red-600 rounded-[8px]">返回</AlertDialogAction>
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

      default:
        return null
    }
  }

  if (!userData) return <div>使用者未登入...</div>

  return (
    <div className="flex h-screen bg-gray-900">
      {/* 側邊欄 */}
      <div className="w-64 border-r bg-gray-800 p-4">
        <div className="space-y-4">
          
          <button 
            className={`flex items-center space-x-3 p-3 w-full text-left rounded-lg ${activeTab === "orders" ? "bg-blue-600" : "hover:bg-gray-600"}`}
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingCart className="h-5 w-5 text-gray-300" />
            <span className="text-gray-300">預約資訊</span>
          </button>
          
          <button 
            className={`flex items-center space-x-3 p-3 w-full text-left rounded-lg ${activeTab === "profile" ? "bg-blue-600" : "hover:bg-gray-600"}`}
            onClick={() => setActiveTab("profile")}
          >
            <User className="h-5 w-5 text-gray-300" />
            <span className="text-gray-300">個人資料</span>
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

const EditBookingForm = ({ booking, showTemporaryAlert, setIsDialogOpen }) => {
  const [selectedDate, setSelectedDate] = useState(booking?.date ? new Date(booking.date) : null);
  const [selectedTime, setSelectedTime] = useState(booking?.time || '');
  const [availableDateRanges, setAvailableDateRanges] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [guests, setGuests] = useState(booking?.numberOfPeople || 1);
  const [isLoading, setIsLoading] = useState(false);

  // Calendar styles
  const calendarStyles = {
    calendar: {
      width: '400px',
      maxWidth: '100%',
      backgroundColor: '#fff',
      color: '#222',
      borderRadius: '8px',
      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
      fontFamily: 'Arial, Helvetica, sans-serif',
      lineHeight: '1.125em',
      padding: '1rem'
    },
    caption: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.5rem',
      alignItems: 'center'
    },
    caption_label: {
      fontSize: '1rem',
      fontWeight: 'bold'
    },
    nav: {
      display: 'flex',
      gap: '0.5rem'
    },
    nav_button: {
      color: '#0047AB',
      minWidth: '44px',
      background: 'none',
      fontSize: '16px',
      padding: '4px',
      cursor: 'pointer'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    head_cell: {
      padding: '0.5rem',
      textAlign: 'center',
      fontWeight: 'normal',
      fontSize: '0.875rem',
      color: '#1E3A8A'
    },
    cell: {
      padding: '0.25rem',
      textAlign: 'center'
    },
    day: {
      width: '40px',
      height: '40px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '6px',
      cursor: 'pointer',
      margin: '2px',
      border: 'none',
      background: 'none'
    },
    day_today: {
      backgroundColor: '#1E3A8A33',
      fontWeight: 'bold',
      color: '#1E3A8A'
    },
    day_selected: {
      backgroundColor: '#003366',
      color: 'white',
      fontWeight: 'bold'
    },
    day_disabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  };

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
        }
      } catch (error) {
        console.error('獲取可用日期失敗:', error);
      }
      setIsLoading(false);
    };

    fetchAvailableDates();
  }, [booking.restaurantId]);

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

  const handleBooking = async () => {
  
    if (!selectedDate || !selectedTime) return;
    
    setIsLoading(true);
    try {
      const formattedDate = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000))
        .toISOString()
        .split('T')[0];
  
      const reservationData = {
        restaurantId: booking.restaurantId,
        reservationDate: formattedDate,
        reservationTime: selectedTime,
        numberOfPeople: guests,
      };
      console.log(reservationData);
      const apiResponse = await updateReservation(booking.id, reservationData);
      
      if (apiResponse.message === '預約更新成功!') {

        showTemporaryAlert('更新成功', '預約資訊已成功更新!', 'check');
        setIsDialogOpen(false);

        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.error('預約失敗:', error);
      showTemporaryAlert('更新失敗', '預約更新失敗，請稍後再試!', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[90vh]">
      <div className="flex-1 overflow-y-auto px-4">
        <form className="space-y-6">
          <div className="space-y-6 pb-20">
            {/* 日期選擇 */}
            <div className="space-y-2">
              <h3 className="text-base pb-2 mb-4 border-b flex items-center bg-white">
                <CalendarCheck className="mr-2" />
                選擇日期
              </h3>
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setSelectedTime(null);
                }}
                disabled={(date) => !isDateInRange(date)}
                fromDate={new Date()}
                toDate={availableDateRanges.reduce((maxDate, range) => {
                  const endDate = new Date(range.endDate);
                  return endDate > maxDate ? endDate : maxDate;
                }, new Date())}
                className="border rounded-lg"
                styles={{
                  ...calendarStyles,
                  day_selected: (baseStyle) => ({
                    ...baseStyle,
                    ...calendarStyles.day_selected
                  }),
                  day_today: (baseStyle) => ({
                    ...baseStyle,
                    ...calendarStyles.day_today
                  })
                }}
                modifiersStyles={{
                  disabled: calendarStyles.day_disabled,
                  today: calendarStyles.day_today,
                  selected: calendarStyles.day_selected
                }}
              />
            </div>

            {/* 時間選擇 */}
            <div className="space-y-2">
              <h3 className="text-base pb-2 mb-4 border-b flex items-center">
                <Clock className="mr-2" />
                選擇時間
              </h3>
              <Select
                value={selectedTime}
                onValueChange={setSelectedTime}
                disabled={!selectedDate || isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={isLoading ? "載入中..." : "請選擇時段"} />
                </SelectTrigger>
                <SelectContent>
                  {availableTimeSlots.map(slot => (
                    <SelectItem 
                      key={slot.time} 
                      value={slot.time}
                      className="py-2 border-b last:border-b-0 bg-white"
                    >
                      {slot.time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 人數選擇 */}
            <div className="space-y-2">
              <h3 className="text-base pb-2 mb-4 border-b flex items-center">
                <Users className="mr-2" />
                用餐人數
              </h3>
              <Select
                value={guests.toString()}
                onValueChange={(value) => setGuests(parseInt(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="選擇人數" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <SelectItem 
                      key={num} 
                      value={num.toString()}
                      className="py-2 border-b last:border-b-0 bg-white"
                    >
                      {num} 人
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 預約信息確認 */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm">
              <h3 className="text-base pb-2 mb-4 border-b flex items-center">
                <ClipboardCheck className="mr-2" />
                預約信息確認
              </h3>
              <div className="space-y-3">
                <div className="flex items-center py-2 border-b">
                  <Store className="w-5 h-5 text-blue-500 mr-3" />
                  <span className="text-gray-500 w-20">餐廳</span>
                  <span className="text-gray-700 font-medium">{booking.name}</span>
                </div>
                
                <div className="flex items-center py-2 border-b">
                  <CalendarCheck className="w-5 h-5 text-blue-500 mr-3" />
                  <span className="text-gray-500 w-20">日期</span>
                  <span className="text-gray-700 font-medium">
                    {selectedDate ? format(selectedDate, 'yyyy年MM月dd日') : '尚未選擇'}
                  </span>
                </div>
                
                <div className="flex items-center py-2 border-b">
                  <Clock className="w-5 h-5 text-blue-500 mr-3" />
                  <span className="text-gray-500 w-20">時間</span>
                  <span className="text-gray-700 font-medium">
                    {selectedTime || '尚未選擇'}
                  </span>
                </div>
                
                <div className="flex items-center py-2 border-b">
                  <Users className="w-5 h-5 text-blue-500 mr-3" />
                  <span className="text-gray-500 w-20">人數</span>
                  <span className="text-gray-700 font-medium">{guests} 人</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* 固定在底部的按鈕 */}
      <div className="bg-white border-t p-4 flex justify-end space-x-2">
        <DialogClose asChild>
          <Button variant="outline" type="button" className='text-white bg-red-600 hover:bg-red-700 border-transparent'>
            取消
          </Button>
        </DialogClose>
        <Button
          onClick={handleBooking}
          disabled={!selectedDate || !selectedTime || isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? '更新中...' : '確認修改'}
        </Button>
      </div>
    </div>
  );
};

export default UserDashboard
