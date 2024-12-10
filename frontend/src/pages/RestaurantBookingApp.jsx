import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";

// 模擬餐廳數據，包含 15 家餐廳
const restaurantsData = [
  {
    id: 1,
    name: "美味軒中餐廳",
    image: "/re1.jpg",
    cuisine: "中式料理",
    priceRange: "$$",
    location: "台北市大安區",
    availableTimes: ["12:00", "12:30", "13:00", "18:00", "18:30", "19:00"],
    description: "提供正宗的中式家常菜，環境舒適，適合家庭聚餐。"
  },
  {
    id: 2,
    name: "義大利風味館",
    image: "/re1.jpg",
    cuisine: "義式料理",
    priceRange: "$$$",
    location: "台北市信義區",
    availableTimes: ["12:30", "13:00", "19:00", "19:30", "20:00"],
    description: "精選進口食材，道地義大利風味，提供浪漫用餐體驗。"
  },
  {
    id: 3,
    name: "日式花園料理",
    image: "/re1.jpg",
    cuisine: "日式料理",
    priceRange: "$$",
    location: "台北市松山區",
    availableTimes: ["11:30", "12:00", "13:00", "18:00", "19:00"],
    description: "傳統日本料理，提供各式壽司與刺身，適合小聚或約會。"
  },
  {
    id: 4,
    name: "法國餐廳 Le Bistro",
    image: "/re1.jpg",
    cuisine: "法式料理",
    priceRange: "$$$$",
    location: "台北市中山區",
    availableTimes: ["12:00", "12:30", "13:00", "19:00", "20:00"],
    description: "典雅法式餐廳，提供道地的法國菜及頂級美酒，浪漫的用餐氛圍。"
  },
  {
    id: 5,
    name: "地中海餐廳",
    image: "/re1.jpg",
    cuisine: "地中海料理",
    priceRange: "$$",
    location: "台北市大同區",
    availableTimes: ["11:30", "12:30", "18:00", "19:00", "20:00"],
    description: "以新鮮海鮮為主，搭配橄欖油和新鮮蔬菜，提供健康美味的地中海料理。"
  },
  {
    id: 6,
    name: "台式小吃館",
    image: "/re1.jpg",
    cuisine: "台灣小吃",
    priceRange: "$",
    location: "台北市中正區",
    availableTimes: ["10:30", "11:00", "12:00", "18:00", "19:00"],
    description: "提供台灣地道的小吃，如鹽酥雞、滷肉飯等，熱騰騰的街頭風味。"
  },
  {
    id: 7,
    name: "美式牛排館",
    image: "/re1.jpg",
    cuisine: "美式料理",
    priceRange: "$$$",
    location: "台北市信義區",
    availableTimes: ["12:00", "13:00", "19:00", "20:00"],
    description: "美式牛排餐廳，提供高品質牛排與經典美式菜肴，適合家庭聚餐。"
  },
  {
    id: 8,
    name: "韓式烤肉店",
    image: "/re1.jpg",
    cuisine: "韓式料理",
    priceRange: "$$",
    location: "台北市南港區",
    availableTimes: ["12:30", "13:00", "19:00", "20:00"],
    description: "韓式烤肉餐廳，提供各種肉類，現場烤肉，配上韓式小菜。"
  },
  {
    id: 9,
    name: "西班牙風情餐廳",
    image: "/re1.jpg",
    cuisine: "西班牙料理",
    priceRange: "$$$",
    location: "台北市大安區",
    availableTimes: ["12:00", "18:00", "19:00", "20:00"],
    description: "提供正宗西班牙海鮮飯與塔帕斯，是西班牙風情餐廳的好選擇。"
  },
  {
    id: 10,
    name: "牛肉麵館",
    image: "/re1.jpg",
    cuisine: "中式料理",
    priceRange: "$",
    location: "台北市北投區",
    availableTimes: ["10:30", "12:00", "13:00", "18:00"],
    description: "經典的台灣牛肉麵，湯頭鮮美，麵條Q彈，是台灣小吃的代表。"
  },
  {
    id: 11,
    name: "美味炸雞店",
    image: "/re1.jpg",
    cuisine: "美式料理",
    priceRange: "$",
    location: "台北市中山區",
    availableTimes: ["11:00", "12:30", "19:00", "20:00"],
    description: "提供香酥的炸雞與熱呼呼的薯條，帶有美式風味的小吃店。"
  },
  {
    id: 12,
    name: "越南風味餐廳",
    image: "/re1.jpg",
    cuisine: "越南料理",
    priceRange: "$$",
    location: "台北市士林區",
    availableTimes: ["12:00", "12:30", "18:00", "19:00"],
    description: "提供道地的越南米粉和春捲，清爽美味，適合喜歡亞洲料理的人。"
  },
  {
    id: 13,
    name: "印度風味餐廳",
    image: "/re1.jpg",
    cuisine: "印度料理",
    priceRange: "$$",
    location: "台北市信義區",
    availableTimes: ["12:30", "13:00", "19:00", "20:00"],
    description: "提供正宗印度菜，特色咖哩和香料料理，帶來濃郁的異國風味。"
  },
  {
    id: 14,
    name: "泰國餐廳",
    image: "/re1.jpg",
    cuisine: "泰式料理",
    priceRange: "$$",
    location: "台北市大安區",
    availableTimes: ["12:00", "12:30", "18:00", "19:00"],
    description: "酸辣口味的泰式料理，提供各種炒飯與冬蔭功湯。"
  },
  {
    id: 15,
    name: "素食餐廳",
    image: "/re1.jpg",
    cuisine: "素食料理",
    priceRange: "$$",
    location: "台北市中正區",
    availableTimes: ["12:00", "13:00", "18:00", "19:00"],
    description: "健康素食餐廳，提供多樣的蔬菜和無肉料理，注重食材的天然與營養。"
  }
];

function RestaurantBookingApp() {
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    people: 2,
    minPrice: 0,
    maxPrice: 1000,
    location: ''
  });
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRestaurants = restaurantsData.filter(restaurant => {
    return (
      (searchParams.keyword === '' || restaurant.name.includes(searchParams.keyword)) &&
      (searchParams.location === '' || restaurant.location.includes(searchParams.location))
    );
  });

  const paginatedRestaurants = filteredRestaurants.slice((currentPage - 1) * 12, currentPage * 12);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 搜索面板 */}
      <div className="w-1/3 p-4 bg-gray-100 overflow-y-auto sticky top-0">
        <h2 className="text-2xl font-bold mb-4">餐廳搜索</h2>
        
        <Input 
          placeholder="輸入餐廳名稱" 
          className="mb-3"
          value={searchParams.keyword}
          onChange={(e) => setSearchParams({...searchParams, keyword: e.target.value})}
        />

        <Select 
          value={searchParams.people.toString()} 
          onValueChange={(value) => setSearchParams({...searchParams, people: parseInt(value)})}>
          <SelectTrigger className="mb-3 border-black">
            <SelectValue placeholder="用餐人數" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {[1, 2, 3, 4, 5, 6].map(num => (
              <SelectItem key={num} value={num.toString()}>{num} 人</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex space-x-2 mt-3">
          <Input 
            type="number" 
            placeholder="最低價格" 
            value={searchParams.minPrice}
            onChange={(e) => setSearchParams({...searchParams, minPrice: parseInt(e.target.value)})}
          />
          <Input 
            type="number" 
            placeholder="最高價格" 
            value={searchParams.maxPrice}
            onChange={(e) => setSearchParams({...searchParams, maxPrice: parseInt(e.target.value)})}
          />
        </div>

        <Input 
          placeholder="地點" 
          className="mt-3"
          value={searchParams.location}
          onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
        />
      </div>

      {/* 餐廳結果 */}
      <div className="w-2/3 p-4 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedRestaurants.map(restaurant => (
            <div key={restaurant.id} className="border rounded-lg shadow-md hover:bg-blue-50 transition-colors">
              <img src={restaurant.image} alt={restaurant.name} className="w-full h-48 object-cover" />
              
              <div className="p-3">
                <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                <p className="text-gray-600">{restaurant.cuisine} | {restaurant.priceRange}</p>
                <p className="text-sm text-gray-500 mt-2">{restaurant.description}</p>
                
                <div className="mt-3">
                  <h4 className="font-medium">可預約時段</h4>
                  <div className="flex flex-wrap gap-2">
                    {restaurant.availableTimes.slice(0, 4).map(time => (
                      <span key={time} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {time}
                      </span>
                    ))}
                  </div>
                </div>

                <BookingDialog restaurant={restaurant} />
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

function BookingDialog({ restaurant }) {
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    phone: '',
    email: '',
    time: '',
    date: new Date()
  });

  const handleBooking = () => {
    // 可以在這裡添加預約邏輯，例如發送 API 請求
    console.log('預約詳情:', bookingDetails);
    alert(`成功預約 ${restaurant.name}！`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-3 w-full bg-blue-600 hover:bg-blue-700">預約餐廳</Button>
      </DialogTrigger>
      <DialogContent className="bg-white border border-gray-200 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">預約 {restaurant.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 p-4 bg-white rounded-lg">
          <Input 
            placeholder="姓名" 
            className="border-gray-300"
            value={bookingDetails.name}
            onChange={(e) => setBookingDetails({...bookingDetails, name: e.target.value})}
          />
          <Input 
            placeholder="手機號碼" 
            className="border-gray-300"
            value={bookingDetails.phone}
            onChange={(e) => setBookingDetails({...bookingDetails, phone: e.target.value})}
          />
          <Input 
            placeholder="電子郵件" 
            className="border-gray-300"
            value={bookingDetails.email}
            onChange={(e) => setBookingDetails({...bookingDetails, email: e.target.value})}
          />
          
          <Select 
            value={bookingDetails.time}
            onValueChange={(value) => setBookingDetails({...bookingDetails, time: value})}
          >
            <SelectTrigger className="border-black">
              <SelectValue placeholder="選擇時段" />
            </SelectTrigger>
            <SelectContent>
              {restaurant.availableTimes.map(time => (
                <SelectItem key={time} value={time}>{time}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Calendar
            mode="single"
            selected={bookingDetails.date}
            onSelect={(date) => setBookingDetails({...bookingDetails, date: date})}
            className="rounded-lg border border-gray-300"
          />

          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={handleBooking}
          >
            確認預約
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RestaurantBookingApp;