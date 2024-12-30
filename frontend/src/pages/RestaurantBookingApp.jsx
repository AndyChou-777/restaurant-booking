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

function RestaurantBookingApp({ searchParams, setSearchParams, showTemporaryAlert }) {
  const [restaurants, setRestaurants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const apiResponse = await getAllRestaurants();
        if (apiResponse.message === '餐廳獲取成功') {
          // First, format the basic restaurant data
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
            availableTimes: ['載入中...']
          }));

          setRestaurants(formattedRestaurants);

          const restaurantsWithTimes = await Promise.all(
            formattedRestaurants.map(async (restaurant) => {
              const times = await getAvailableTimes(restaurant.id);
              return {
                ...restaurant,
                availableTimes: times
              };
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

  // 從時間段生成可預約時間
  const getAvailableTimes = async (restaurantId) => {
    try {
      const apiResponse = await fetchAvailabilities(restaurantId);
      if (!apiResponse || !apiResponse.data || apiResponse.data.length === 0) {
        return ['暫無可預約時段'];
      }
  
      const timeSlots = apiResponse.data;
      const times = [];
      
      // 獲取當前時間
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTotalMinutes = currentHour * 60 + currentMinute;
  
      timeSlots.forEach(slot => {
        if (slot.startTime && slot.endTime) {
          const [startHour, startMinute] = slot.startTime.split(':').map(num => parseInt(num));
          const [endHour, endMinute] = slot.endTime.split(':').map(num => parseInt(num));
  
          const startTotalMinutes = startHour * 60 + startMinute;
          const endTotalMinutes = endHour * 60 + endMinute;
  
          // 生成時間段並過濾過去的時間
          for (let minutes = startTotalMinutes; minutes < endTotalMinutes; minutes += 30) {
            // 檢查是否是未來時間
            if (minutes > currentTotalMinutes) {
              const hour = Math.floor(minutes / 60);
              const minute = minutes % 60;
              
              const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
              times.push(timeString);
            }
          }
  
          // 添加結束時間（如果是未來時間且在30分鐘間隔上）
          if (endTotalMinutes > currentTotalMinutes && (endMinute === 0 || endMinute === 30)) {
            times.push(`${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`);
          }
        }
      });
  
      // 如果沒有可用時間段，返回提示信息
      if (times.length === 0) {
        return ['今日已無可預約時段'];
      }
  
      return [...new Set(times)].sort();
    } catch (error) {
      console.error("無法加載可預約時間:", error);
      return ['暫無可預約時段'];
    }
  };

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
      <div className="w-1/4 p-4 bg-gradient-to-b from-yellow-900 to-yellow-600 overflow-y-auto sticky top-0">
        <h2 className="text-2xl font-bold mb-4 text-white">快速搜索</h2>
        
        <Input 
          placeholder="輸入餐廳名稱" 
          className="mb-3 bg-gray-200"
          value={searchParams.keyword}
          onChange={(e) => setSearchParams({...searchParams, keyword: e.target.value})}
        />

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

        <Input 
          placeholder="地點" 
          className="mt-3 bg-gray-200"
          value={searchParams.location}
          onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
        />

        <Input 
          placeholder="標籤" 
          className="mt-3 bg-gray-200"
          value={searchParams.tag}
          onChange={(e) => setSearchParams({...searchParams, tag: e.target.value})}
        /> 

        <Button className="mt-3 w-full shadow-md text-white bg-gray-700 hover:bg-gray-800"
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
      <div className="w-3/4 p-4 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedRestaurants.map(restaurant => (
            <div key={restaurant.id} className="border rounded-lg shadow-md hover:bg-blue-50 transition-colors">
              <img 
                src={restaurant.image} 
                alt={restaurant.name} 
                className="w-full h-48 object-cover rounded-t-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-restaurant.jpg';
                }}
              />
              
              <div className="p-3">
                <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                <p className="text-gray-600">
                  {restaurant.location} | {restaurant.priceRange} $
                  </p>
                <p className="text-sm text-gray-500 mt-2">{restaurant.description}</p>
                <div className="flex gap-2 mt-2">
                  {restaurant.cuisine.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-3">
                  <h4 className="font-medium mb-2">今日尚可預約時段</h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(restaurant.availableTimes) && 
                      restaurant.availableTimes.slice(0, 7).map(time => (
                        <span key={time} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {time}
                        </span>
                      ))}
                  </div>
                </div>

                <BookingDialog restaurant={restaurant} showTemporaryAlert={showTemporaryAlert} />
              </div>
            </div>
          ))}
        </div>

        {/* 分頁 */}
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: Math.ceil(filteredRestaurants.length / 12) }, (_, i) => (
            <Button 
              key={i} 
              variant={currentPage === i + 1 ? "default" : "outline"}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
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

  const getTimeRangeForDate = (date) => {
    if (!date) return null;
    
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    const range = availableDateRanges.find(range => {
      const rangeStart = new Date(range.startDate);
      const rangeEnd = new Date(range.endDate);
      rangeStart.setHours(0, 0, 0, 0);
      rangeEnd.setHours(0, 0, 0, 0);
      
      return checkDate >= rangeStart && checkDate <= rangeEnd;
    });

    console.log('Found time range for date:', date, range);
    return range;
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

  const generateTimeSlots = (startTime, endTime) => {
    const slots = [];
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTotalMinutes = currentHour * 60 + currentMinute;
    
    const isToday = selectedDate && 
      selectedDate.getDate() === now.getDate() &&
      selectedDate.getMonth() === now.getMonth() &&
      selectedDate.getFullYear() === now.getFullYear();

    for (let time = startTotalMinutes; time < endTotalMinutes; time += 30) {
      const hour = Math.floor(time / 60);
      const minute = time % 60;
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // 如果是今天，只顯示未來的時間段
      if (isToday && time <= currentTotalMinutes) {
        continue;
      }
      
      slots.push({
        time: timeString,
        disabled: false
      });
    }
    
    return slots;
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
      showTemporaryAlert('預約失敗', '用戶尚未登入或登入錯誤!', '/');
    }
  };

  // 更新時間選擇的下拉選單部分
  const renderTimeSelect = () => {
    if (!selectedDate) return null;

    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium">選擇時段</h3>
        <Select
          value={selectedTime}
          onValueChange={setSelectedTime}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={isLoading ? "載入中..." : "請選擇時間"} />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <SelectItem value="loading">載入中...</SelectItem>
            ) : availableTimeSlots.length > 0 ? (
              availableTimeSlots.map(slot => (
                <SelectItem
                  key={slot.time}
                  value={slot.time}
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
          <Button className="mt-3 w-full text-white bg-blue-500 hover:bg-blue-600">
            預約餐廳
          </Button>
        </DialogTrigger>
        
        <DialogContent className="bg-white border border-gray-200 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              預約 {restaurant.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 p-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">選擇日期</h3>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setSelectedTime(null); // 重置時間選擇
                }}
                disabled={(date) => !isDateInRange(date)}
                className="rounded-lg border border-gray-300"
                fromDate={new Date()}
                toDate={availableDateRanges.reduce((maxDate, range) => {
                  const endDate = new Date(range.endDate);
                  return endDate > maxDate ? endDate : maxDate;
                }, new Date())}
              />
            </div>

            {renderTimeSelect()}

            {/* 人數輸入 */}
            <div>
              <h3 className="text-sm font-medium">輸入人數</h3>
              <Input
                type="number"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(Math.max(1, parseInt(e.target.value) || 1))}
                min={1}
                placeholder="輸入人數"
                className="w-full rounded-lg border border-gray-300"
              />
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => handleBooking(restaurant.id, selectedDate, selectedTime, numberOfPeople)}
              disabled={!selectedDate || !selectedTime || isLoading}
            >
              確認預約
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