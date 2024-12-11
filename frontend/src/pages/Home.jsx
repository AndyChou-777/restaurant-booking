import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
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
              placeholder="Search for restaurants"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-grow px-4 py-3 rounded-l-lg border"
            />
            <Button 
              onClick={handleSearch}
              className="rounded-r-lg bg-red-500"
            >
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Banner 輪播 */}
      <section className="container mx-auto my-16 my-0">
        <Carousel>
          <CarouselContent>
            <CarouselItem>
              <img 
                src={"/re7.jpg"} 
                alt=""
                className="w-full h-[500px] object-cover rounded-lg"
              />
            </CarouselItem>
            <CarouselItem>
              <img 
                src={"/re8.jpg"} 
                alt="" 
                className="w-full h-[500px] object-cover rounded-lg"
              />
            </CarouselItem>
            <CarouselItem>
              <img 
                src={"/re9.jpg"} 
                alt="" 
                className="w-full h-[500px] object-cover rounded-lg"
              />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* Hero 1: 一般會員介紹 */}
      <section className="container mx-0 grid grid-cols-2 gap-10 items-center my-0">
        <div className="col-span-1">
          <img 
            src={"/re10.jpg"} 
            alt="Personal Member" 
            className="w-full h-[400px] object-cover rounded-lg"
          />
        </div>
        <div className="col-span-1 space-y-6">
          <h2 className="text-3xl font-bold">一般會員專屬優惠</h2>
          <p className="text-gray-600 leading-relaxed">
            成為一般會員，享受專屬優惠和便利服務。快速訂位、即時餐廳資訊、個人化推薦，讓您的用餐體驗更加輕鬆愉快。
          </p>
          <Link to="/register/user">
            <Button>立即成為會員</Button>
          </Link>
        </div>
      </section>

      {/* Hero 2: 企業會員介紹 */}
      <section className="container mx-0 grid grid-cols-2 gap-10 items-center my-0 bg-black">
        <div className="col-span-1 space-y-6">
          <h2 className="text-3xl font-bold text-white">企業會員專屬服務</h2>
          <p className="text-white leading-relaxed">
            為餐廳量身打造的會員服務。提供數據分析、客戶管理、行銷工具，幫助您提升營業額和顧客滿意度。
          </p>
          <Link to="/register/business">
            <Button className="bg-blue-700 text-white">企業會員申請</Button>
          </Link>
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
          <h2 className="text-4xl font-bold mb-6 text-black">
            暢遊美食世界，輕鬆找餐廳
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            我們致力於提供最便捷的餐廳搜尋和訂位服務，無論您是美食愛好者還是餐廳老闆，都能在這裡找到理想的用餐體驗。
          </p>
          <Link to="/restaurant-reservation">
            <Button variant="secondary" size="lg">
              立即探索美食
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
