import React, { useState, useEffect } from "react"
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

function Header( {isLoggedIn, userRole, handleLogout, showTemporaryAlert} ) {

  const navigationMenuTriggerStyle = () => 
    cn("group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none")

  return (
    <header className="bg-[#333] flex justify-between items-center p-[10px_20px] text-white relative">
      <div className="flex items-center">
        <Link to="/">
          <img 
            src="/home_logo.png" 
            alt="餐廳預約網站 Logo" 
            className="w-[60px] h-auto mr-[10px]" 
          />
        </Link>
        <Link to="/">
        <span className="text-2xl font-bold mr-[50px]">OMOTENASHI</span>
        </Link>
        
  {/* 添加 ml-auto 使导航菜单靠左 */}
  <NavigationMenu className="ml-auto">
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger>立即開始</NavigationMenuTrigger>
        <NavigationMenuContent className="absolute left-0 bg-gray-800 w-full max-w-[700px] p-4 box-border">
        <ul className="grid bg-gray-800 text-white w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
          <ListItem href="/" title="關於我們">
            旨在打造能夠滿足所有需求的線上餐廳預約平台，讓每個使用者都能輕鬆找到心儀的餐廳並完成預約。
          </ListItem>
          <ListItem href="/restaurant-reservation" title="搜索餐廳">
            體驗功能最強大，資源最齊全的預約系統。通過我們的搜索功能，您可以輕鬆查找並預訂附近的餐廳，
          </ListItem>
        </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>

    {isLoggedIn? (
      <NavigationMenuItem>
      <NavigationMenuTrigger>會員中心</NavigationMenuTrigger>
      <NavigationMenuContent className="absolute left-0 bg-gray-800 w-full max-w-[700px] p-4 box-border">
        <ul className="grid bg-gray-800 text-white w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
        {userRole === 'BUSINESS_USER' ? (
          <ListItem href="/business/dashboard" title="企業會員管理">
            管理您的預約狀態，增加顧客的來源。企業會員可以享受更多的功能，如設定特別優惠，查看預約統計數據，
            以及增加顧客忠誠度的工具。
          </ListItem>
          ) : (
          <ListItem href="/user/dashboard" title="一般會員管理">
            一般會員可隨時查看自己的預約紀錄，管理已完成和待完成的預約，並且輕鬆修改個人資料或支付資訊。
            此外，還可享受我們的會員專屬優惠。
          </ListItem>
          )}
          <ListItem href="#" title="登出"
           onClick={(e) => {
            e.preventDefault();
            handleLogout();
            showTemporaryAlert('登出成功', '用戶登出成功', '/');  // 指定跳轉到首頁
          }}>
            當您完成使用網站時，可以隨時選擇登出。登出後，您的帳戶資料將會保護，避免他人查看或修改您的資料。
            記得在公共電腦或其他設備上登出，確保資料安全。
          </ListItem>
        </ul>
      </NavigationMenuContent>
      </NavigationMenuItem>
    ) : (
      <NavigationMenuItem>
      <NavigationMenuTrigger>會員中心</NavigationMenuTrigger>
      <NavigationMenuContent className="absolute left-0 bg-gray-800 w-full max-w-[700px] p-4 box-border">
        <ul className="grid bg-gray-800 text-white w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
          <ListItem href="/login" title="登入">
            輕鬆登入並開始您的餐廳預約之旅。只需輸入帳號和密碼，即可快速進入會員專屬頁面，管理您的預約。
            也可以選擇使用第三方登入服務，如 Google 或 Facebook。
          </ListItem>
        </ul>
      </NavigationMenuContent>
      </NavigationMenuItem>
    )
    
    }

    <NavigationMenuItem>
      <NavigationMenuTrigger>{userRole || '未設定角色'}</NavigationMenuTrigger>
      <NavigationMenuContent className="absolute left-0 bg-gray-800 w-full max-w-[700px] p-4 box-border">
        <ul className="grid bg-gray-800 text-white w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
          <ListItem href="/business/dashboard" title="企業會員管理">
            管理您的預約狀態，增加顧客的來源。企業會員可以享受更多的功能，如設定特別優惠，查看預約統計數據，
            以及增加顧客忠誠度的工具。
          </ListItem>
          <ListItem href="/user/dashboard" title="一般會員管理">
            一般會員可隨時查看自己的預約紀錄，管理已完成和待完成的預約，並且輕鬆修改個人資料或支付資訊。
            此外，還可享受我們的會員專屬優惠。
          </ListItem>
          <ListItem href="/login" title="登入">
            輕鬆登入並開始您的餐廳預約之旅。只需輸入帳號和密碼，即可快速進入會員專屬頁面，管理您的預約。
            也可以選擇使用第三方登入服務，如 Google 或 Facebook。
          </ListItem>
          <ListItem href="/login" title="登出">
            當您完成使用網站時，可以隨時選擇登出。登出後，您的帳戶資料將會保護，避免他人查看或修改您的資料。
            記得在公共電腦或其他設備上登出，確保資料安全。
          </ListItem>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>

    <NavigationMenuItem>
      <NavigationMenuTrigger>註冊會員</NavigationMenuTrigger>
      <NavigationMenuContent className="absolute left-0 bg-gray-800 w-full max-w-[700px] p-4 box-border">
        <ul className="grid bg-gray-800 text-white w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
          <ListItem href="/register/business" title="企業會員註冊">
            企業會員註冊將讓您享有更多的管理功能與專屬服務。註冊後，您可以設定餐廳資訊，查看預約情況，
            並進行顧客數據分析。
          </ListItem>
          <ListItem href="/register/user" title="一般會員註冊">
            成為我們的一般會員，您可以輕鬆瀏覽餐廳選單，預約座位，並享有會員專屬的優惠。註冊過程簡單，
            只需要提供基本資訊即可啟用所有功能。
          </ListItem>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
  </NavigationMenu>
      </div>
    </header>
  )
}

const ListItem = React.forwardRef(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-2x1 font-bold leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground ">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";

export default Header;


