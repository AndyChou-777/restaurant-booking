import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { getAllRestaurants } from '@/service/restaurantService';
import { fetchAvailabilities, getAllAvailabilities } from '@/service/availabilityService';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { createReservation, getAvailabilities } from '@/service/reservationService';
import { Search, UtensilsCrossed, CircleDollarSign, MapPin, Tag, DollarSign, Clock, Store, Utensils, SquarePen, CalendarFold, UsersRound, NotebookPen, ClipboardCheck, CalendarCheck, CalendarPlus, Users, } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';

function RestaurantBookingApp({ searchParams, setSearchParams, showTemporaryAlert }) {
  const [restaurants, setRestaurants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const apiResponse = await getAllRestaurants();
        if (apiResponse.message === '餐廳獲取成功') {
          const formattedRestaurants = apiResponse.data.map(restaurant => ({
            id: restaurant.id,
            name: restaurant.name,
            image: restaurant.imageBase64List && restaurant.imageBase64List.length > 0 
              ? restaurant.imageBase64List[0]
              : '/placeholder-restaurant.jpg',
            cuisine: restaurant.tags,
            priceRange: restaurant.averageSpending,
            location: restaurant.address,
            description: restaurant.description,
            availableTimes: []
          }));

          setRestaurants(formattedRestaurants);

          // 獲取今天的日期
          const today = new Date();
          const formattedDate = today.toISOString().split('T')[0];

          const restaurantsWithTimes = await Promise.all(
            formattedRestaurants.map(async (restaurant) => {
              try {
                const availabilityResponse = await getAvailabilities(restaurant.id, formattedDate);
                return {
                  ...restaurant,
                  availableTimes: availabilityResponse.status === 200 ? availabilityResponse.data : []
                };
              } catch (error) {
                console.error(`無法獲取餐廳 ${restaurant.id} 的可用時段:`, error);
                return {
                  ...restaurant,
                  availableTimes: []
                };
              }
            })
          );

          setRestaurants(restaurantsWithTimes);
        }
      } catch (error) {
        console.error("無法加載餐廳資料:", error);
      }
    };
    
    loadRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesKeyword = searchParams.keyword === '' || 
      restaurant.name.toLowerCase().includes(searchParams.keyword.toLowerCase());
    
    const matchesLocation = searchParams.location === '' || 
      restaurant.location.toLowerCase().includes(searchParams.location.toLowerCase());

    const matchesTags = searchParams.tag === '' || (
      restaurant.cuisine.some(tag => 
        tag.toLowerCase().includes(searchParams.tag.toLowerCase())
      )
    );

    const matchesPriceRange = 
    (searchParams.minPrice === null || restaurant.priceRange >= searchParams.minPrice) &&
    (searchParams.maxPrice === null || restaurant.priceRange <= searchParams.maxPrice);

    
    return matchesKeyword && matchesLocation && matchesTags && matchesPriceRange;
  });

  const paginatedRestaurants = filteredRestaurants.slice((currentPage - 1) * 12, currentPage * 12);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 搜索面板 */}
      <div className="w-1/4 p-4 bg-gradient-to-b from-yellow-700 to-yellow-500 overflow-y-auto sticky top-0">
        <h2 className="text-2xl font-bold mb-6 text-black flex items-center space-x-2">
          <Search /> 
          <span>快速搜索</span>
        </h2>
        
        <div className="font-bold mb-3 text-gray-800 flex items-center space-x-2">
          <UtensilsCrossed /> 
          <span>餐廳名稱</span>
        </div>

        <Input 
          placeholder="查詢餐廳" 
          className="mb-3 bg-gray-200"
          value={searchParams.keyword}
          onChange={(e) => setSearchParams({...searchParams, keyword: e.target.value})}
        />

        <div className="font-bold mb-3 text-gray-800 flex items-center space-x-2">
          <CircleDollarSign /> 
          <span>平均消費</span>
        </div>

        <div className="flex space-x-2 mt-3">
          <Input 
            type="number" 
            placeholder="最低價格" 
            className='bg-gray-200'
            value={searchParams.minPrice === null ? '' : searchParams.minPrice}
            onChange={(e) => setSearchParams({
              ...searchParams,
              minPrice: e.target.value === '' ? null : parseInt(e.target.value)
            })}
          />
          <Input 
            type="number" 
            placeholder="最高價格" 
            className='bg-gray-200'
            value={searchParams.maxPrice === null ? '' : searchParams.maxPrice}
            onChange={(e) => setSearchParams({
              ...searchParams,
              maxPrice: e.target.value === '' ? null : parseInt(e.target.value)
            })}
          />
        </div>

        <div className="font-bold mb-3 mt-3 text-gray-800 flex items-center space-x-2">
          <MapPin /> 
          <span>餐廳地址</span>
        </div>

        <Input 
          placeholder="地點" 
          className="mt-3 bg-gray-200"
          value={searchParams.location}
          onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
        />

        <div className="font-bold mb-3 mt-3 text-gray-800 flex items-center space-x-2">
          <Tag /> 
          <span>餐廳標籤</span>
        </div>

        <Input 
          placeholder="標籤" 
          className="mt-3 bg-gray-200"
          value={searchParams.tag}
          onChange={(e) => setSearchParams({...searchParams, tag: e.target.value})}
        /> 

        <Button className="mt-6 w-full font-bold py-2 text-white bg-gradient-to-r from-amber-900 to-amber-700 hover:fromgray-800 hover:to-amber-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        onClick={() => setSearchParams({
              keyword: '',
              minPrice: null,
              maxPrice: null,
              location: '',
              tag: '',
            })}
        >
          清空條件
        </Button>
      </div>
      
      {/* 餐廳結果 */}
      <div className="w-3/4 p-4 overflow-y-auto bg-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedRestaurants.map(restaurant => (
            <div key={restaurant.id} className="bg-white border rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="relative">
                <img 
                  src={restaurant.image} 
                  alt={restaurant.name} 
                  className="w-full h-48 object-cover rounded-t-lg brightness-95"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-restaurant.jpg';
                  }}
                />
              </div>
              
              <div className="p-4">
                
                <h3 className="text-xl font-bold text-gray-800 mb-2 font-serif flex">
                  <Utensils className="mr-2" />
                  <span>{restaurant.name}</span>
                </h3>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin size={16} className="mr-1" />
                  <span className="text-sm">{restaurant.location}</span>
                  <span className="mx-2">|</span>
                  <DollarSign size={16} className="mr-1" />
                  <span className="text-sm">{restaurant.priceRange}</span>
                </div>

                <p className="text-l text-black mb-3 line-clamp-2">{restaurant.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {restaurant.cuisine.map((tag, index) => (
                    <span key={index} className="inline-flex items-center bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                      <Tag size={12} className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="border-t pt-3">
                  <h4 className="flex items-center text-black font-bold mb-2">
                    <Clock size={16} className="mr-2" />
                    當日可預約時段
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {restaurant.availableTimes && restaurant.availableTimes.length > 0 ? (
                      restaurant.availableTimes.slice(0, 12).map(time => (
                        <span key={time} className="bg-blue-400 text-white text-xs px-2 py-1 rounded-full">
                          {time}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm mt-4 mb-5">今日已無可預約時段</span>
                    )}
                  </div>
                </div>

                <BookingDialog restaurant={restaurant} showTemporaryAlert={showTemporaryAlert} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// BookingDialog 組件
function BookingDialog({ restaurant, showTemporaryAlert }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [availableDateRanges, setAvailableDateRanges] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
    if (isOpen) {
      fetchAvailableDates();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedDate) {
      getAvailableTimesForDate(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailableDates = async () => {
    setIsLoading(true);
    try {
      const apiResponse = await getAllAvailabilities(restaurant.id);
      console.log('API Response:', apiResponse);

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

  const getAvailableTimesForDate = async (date) => {
    setIsLoading(true);
    try {
      const formattedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
      .toISOString()
      .split('T')[0];
      const data = await getAvailabilities(restaurant.id, formattedDate);

      if (data.status === 200 && data.data) {
        // 將回傳的時段轉換為下拉選單需要的格式
        const slots = data.data.map(time => ({
          time: time,
          disabled: false
        }));
        setAvailableTimeSlots(slots);
      } else {
        setAvailableTimeSlots([]);
      }
    } catch (error) {
      console.error('獲取可用時段失敗:', error);
      setAvailableTimeSlots([]);
    }
    setIsLoading(false);
  };

  const handleBooking = async (id, date, time, number) => {
    if (!selectedDate || !selectedTime) return;
    try {
      // 處理日期時區問題
      const formattedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
        .toISOString()
        .split('T')[0];
  
      const reservationData = {
        restaurantId: id,
        reservationDate: formattedDate,  // 使用修正後的日期
        reservationTime: time,
        numberOfPeople: number,
      };
  
      console.log('Sending reservation data:', reservationData); // 用於調試
  
      const apiResponse = await createReservation(reservationData);
      
      if (apiResponse.status === 200) {
        setIsOpen(false);
        setShowConfirm(true);
      }
    } catch (error) {
      console.error('預約失敗:', error);
      setIsOpen(false)
      showTemporaryAlert('預約失敗', '用戶尚未登入或登入錯誤!', 'error', '/login');
    }
  };

  // 更新時間選擇的下拉選單部分
  const renderTimeSelect = () => {
    if (!selectedDate) return null;

    return (
      <div className="space-y-2">
        <h3 className="text-base pb-2 mb-4 border-b flex">
          <Clock className='mr-2' />
          選擇時段
        </h3>
        <Select
          value={selectedTime}
          onValueChange={setSelectedTime}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={isLoading ? "載入中..." : "請選擇時間"} />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {isLoading ? (
              <SelectItem value="loading">載入中...</SelectItem>
            ) : availableTimeSlots.length > 0 ? (
              availableTimeSlots.map(slot => (
                <SelectItem
                  key={slot.time}
                  value={slot.time}
                  className="border-b py-2"
                >
                  {slot.time}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-slots">無可用時段</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="mt-3 w-full text-white font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/20 hover:shadow-blue-600/30 transition-all duration-300">
            <SquarePen />
            預約餐廳
          </Button>
        </DialogTrigger>
        
        <DialogContent className="bg-white border border-gray-200 shadow-lg max-h-[90vh] w-full flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-gray-800 flex justify-center items-center pt-2">
              <NotebookPen className='mr-2'/>
              預約{restaurant.name}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-4">
            <div className="space-y-2 ">
              <h3 className="text-base pb-2 mb-4 border-b flex sticky top-0 bg-white z-10">
                <CalendarFold className='mr-2'/>
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
                className='border'
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

            {renderTimeSelect()}

            {/* 人數輸入 */}
            <div>
              <h3 className="text-base pb-2 mb-4 border-b flex sticky top-0 bg-white z-10">
                <UsersRound className='mr-2' />
                輸入人數
              </h3>
              <Input
                type="number"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(Math.max(1, parseInt(e.target.value) || 1))}
                min={1}
                placeholder="輸入人數"
                className="w-full rounded-lg border border-black"
              />
            </div>

            {/* 預約信息摘要表格 */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm">
                <h3 className="text-base pb-2 mb-4 border-b flex items-center text-gray-700 sticky top-0 bg-gray-50 z-10">
                  <ClipboardCheck className="mr-2" />
                  預約信息確認
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center py-2 border-b border-gray-100">
                    <Store className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-500 w-20 flex-shrink-0">餐廳</span>
                    <span className="text-gray-700 font-medium truncate">{restaurant.name}</span>
                  </div>
                  
                  <div className="flex items-center py-2 border-b border-gray-100">
                    <CalendarCheck className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-500 w-20 flex-shrink-0">日期</span>
                    <span className="text-gray-700 font-medium">
                      {selectedDate ? format(selectedDate, 'yyyy年MM月dd日') : '尚未選擇'}
                    </span>
                  </div>
                  
                  <div className="flex items-center py-2 border-b border-gray-100">
                    <Clock className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-500 w-20 flex-shrink-0">時間</span>
                    <span className="text-gray-700 font-medium">
                      {selectedTime || '尚未選擇'}
                    </span>
                  </div>
                  
                  <div className="flex items-center py-2 border-b border-gray-100">
                    <Users className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-500 w-20 flex-shrink-0">人數</span>
                    <span className="text-gray-700 font-medium">{numberOfPeople} 人</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

            {/* 按鈕固定在底部 */}
          <div className="p-4 border-t mt-4 bg-white">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
              onClick={() => handleBooking(restaurant.id, selectedDate, selectedTime, numberOfPeople)}
              disabled={!selectedDate || !selectedTime || isLoading}
            >
              <CalendarPlus className="w-5 h-5" />
              <span>確認預約</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className='bg-white'>
          <AlertDialogHeader>
            <AlertDialogTitle>預約成功！</AlertDialogTitle>
            <AlertDialogDescription>
              您已成功預約 {restaurant.name} 於 {selectedDate?.toLocaleDateString()} {selectedTime} 的座位。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
            className='bg-blue-500 text-white font-bold shadow-md hover:bg-blue-600 rounded-[8px]'
            onClick={() => setShowConfirm(false)}>
              確定
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default RestaurantBookingApp;