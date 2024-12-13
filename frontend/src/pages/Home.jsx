import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import Autoplay from "embla-carousel-autoplay"
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel"

function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate('/restaurant-reservation');
  };

  const plugin = useRef(
    Autoplay({ 
      delay: 4000, 
      stopOnInteraction: true,
      loop: true
    })
  )

  const carouselItems = [
    {
      image: "/re7.jpg",
      title: "美食探索",
      description: "發現城市中最令人驚豔的餐廳",
      linkTo: "/restaurant-reservation",
      linkText: "立即探索"
    },
    {
      image: "/re8.jpg",
      title: "客製化推薦",
      description: "根據您的口味提供精準的餐廳推薦",
      linkTo: "/recommendation",
      linkText: "開始推薦"
    },
    {
      image: "/re9.jpg",
      title: "即時訂位",
      description: "快速、方便地預訂您心儀的餐廳",
      linkTo: "/reservation",
      linkText: "立即訂位"
    },
    {
      image: "/re3.jpg",
      title: "會員優惠",
      description: "獨家優惠等您來發現",
      linkTo: "/register/user",
      linkText: "加入會員"
    },
    {
      image: "/re10.jpg",
      title: "美食社群",
      description: "分享您的美食體驗",
      linkTo: "/community",
      linkText: "加入社群"
    }
  ];

  return (
    <div>
      <section 
  className="hero bg-cover bg-center h-screen flex items-center justify-center" 
  style={{ backgroundImage: 'url("/Testingimg.jpg")' }}
>
  <div className="search-box w-full max-w-xl px-4">
    <div className="flex">
      <input
        type="text"
        placeholder="一鍵搜索熱門餐廳"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
      />
      <Button 
        onClick={handleSearch}
        className="ml-[-1px] bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-3 px-6 rounded-r-lg shadow-md hover:scale-105 transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500"
        style={{ height: 'auto', borderRadius: '8px' }}
      >
        Search
      </Button>
    </div>
  </div>
</section>

      {/* Banner 輪播 */}
      <div className="relative w-full px-10 py-6"
           style={{ backgroundImage: 'url("/re7.jpg")' }}>
        <Carousel 
          plugins={[plugin.current]} 
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-4">
            {carouselItems.map((item, index) => (
              <CarouselItem 
                key={index} 
                className="pl-4 basis-1/3"
              >
                <div className="relative group overflow-hidden rounded-lg">
                  <img 
                    src={item.image} 
                    alt={`Carousel Image ${index + 1}`}
                    className="w-full h-[300px] object-cover"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                    <p className="mb-4">{item.description}</p>
                    <Link to={item.linkTo} className="transition-opacity duration-300">
                      <Button variant="secondary" className="ml-[-1px] bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-6 rounded-r-lg shadow-md hover:scale-105 transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500"
                      style={{ height: 'auto', borderRadius: '8px' }}>
                        {item.linkText}
                      </Button>
                    </Link>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute top-1/2 left-0 transform -translate-y-1/2 text-white" />
          <CarouselNext className="absolute top-1/2 right-0 transform -translate-y-1/2 text-white" />
        </Carousel>
      </div>
      
      {/* Hero 1: 一般會員介紹 */}
      <section className="mx-0 grid grid-cols-2 gap-10 items-center my-0">
        <div className="col-span-1">
          <img 
            src={"/re10.jpg"} 
            alt="Personal Member" 
            className="w-full h-[400px] object-cover rounded-lg"
          />
        </div>
        <div className="col-span-1 space-y-6">
          <h2 className="text-3xl font-bold text-center">一般會員專屬優惠</h2>
          <p className="text-gray-600 leading-relaxed text-center">
            成為一般會員，享受專屬優惠和便利服務。快速訂位、即時餐廳資訊、個人化推薦，讓您的用餐體驗更加輕鬆愉快
          </p>
          <div className="flex justify-center">
            <Link to="/register/user">
              <Button className="ml-[-1px] bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-3 px-6 rounded-r-lg shadow-md hover:scale-105 transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500"
              style={{ height: 'auto', borderRadius: '8px' }}>
                立即成為會員
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Hero 2: 企業會員介紹 */}
      <section className="mx-0 grid grid-cols-2 gap-10 items-center my-0 bg-black">
        <div className="col-span-1 space-y-6">
          <h2 className="text-3xl font-bold text-white text-center">企業會員專屬服務</h2>
          <p className="text-white leading-relaxed text-center">
            為餐廳量身打造的會員服務。提供數據分析、客戶管理、行銷工具，幫助您提升營業額和顧客滿意度
          </p>
          <div className="flex justify-center">
            <Link to="/register/business">
              <Button className="ml-[-1px] bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-r-lg shadow-md hover:scale-105 transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ height: 'auto', borderRadius: '8px' }}>
              企業會員申請
              </Button>
            </Link>
          </div>
        </div>
        <div className="col-span-1">
          <img 
            src={"/re3.jpg"} 
            alt="Business Member" 
            className="w-full h-[400px] object-cover rounded-lg"
          />
        </div>
      </section>

      {/* 橫幅 Banner */}
      <section className="bg-indigo-600 text-white py-20 text-center">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-white">
            暢遊美食世界 輕鬆找餐廳
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            我們致力於提供最便捷的餐廳搜尋和訂位服務，無論您是美食愛好者還是餐廳老闆，都能在這裡找到理想的用餐體驗
          </p>
          <Link to="/restaurant-reservation">
            <Button className="ml-[-1px] bg-gradient-to-r from-purple-400 to-pink-500 text-white font-bold py-3 px-6 rounded-r-lg shadow-md hover:scale-105 transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{ height: 'auto', borderRadius: '8px' }}>
              立即探索美食
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}


export default Home;
