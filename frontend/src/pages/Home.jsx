import React, { useState } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const Testingimg = '/Testingimg.jpg';

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const fetchedRestaurants = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `Restaurant ${i + 1}`,
      image: Testingimg, // 用一個公共圖片 URL 測試
    }));
    setRestaurants(fetchedRestaurants);
  };



  return (
    <div>
      <section className="hero">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search for restaurants"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Link to="/restaurant-reservation">
          <button onClick={handleSearch}>Search</button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
