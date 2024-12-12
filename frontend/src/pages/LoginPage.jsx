import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function LoginPage() {
  return (
    <div className="flex h-screen">
      {/* 左側背景圖 */}
      <div className="w-1/2 bg-cover bg-center rounded-l-lg" style={{
        backgroundImage: 'url("/re2.jpg")'
      }}>
      </div>

      {/* 右側登入區域 */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 p-8 rounded-r-lg">
        <Tabs defaultValue="personal" className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger 
              value="personal" 
              className="text-lg font-semibold text-gray-800 focus:ring-0 hover:text-blue-600"
            >
              一般用戶
            </TabsTrigger>
            <TabsTrigger 
              value="enterprise" 
              className="text-lg font-semibold text-gray-800 focus:ring-0 hover:text-blue-600"
            >
              企業用戶
            </TabsTrigger>
          </TabsList>
          
          {/* 一般用戶登入 */}
          <TabsContent value="personal">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-center text-gray-800">一般用戶登入</h2>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="personal-email">電子郵件</Label>
                  <Input 
                    id="personal-email" 
                    type="email" 
                    placeholder="輸入您的電子郵件" 
                    className="mt-2 p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="personal-password">密碼</Label>
                  <Input 
                    id="personal-password" 
                    type="password" 
                    placeholder="輸入您的密碼" 
                    className="mt-2 p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:scale-105 transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500">
                  登入
                </Button>
                <div className="text-center text-sm text-gray-600">
                  還沒有帳號？ 
                  <a href="#" className="text-blue-600 hover:underline">
                    立即註冊
                  </a>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* 企業用戶登入 */}
          <TabsContent value="enterprise">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-center text-gray-800">企業用戶登入</h2>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="enterprise-account">企業帳號</Label>
                  <Input 
                    id="enterprise-account" 
                    type="text" 
                    placeholder="輸入企業帳號" 
                    className="mt-2 p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="enterprise-password">密碼</Label>
                  <Input 
                    id="enterprise-password" 
                    type="password" 
                    placeholder="輸入您的密碼" 
                    className="mt-2 p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:scale-105 transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500">
                  登入
                </Button>
                <div className="text-center text-sm text-gray-600">
                  忘記密碼？ 
                  <a href="#" className="text-blue-600 hover:underline">
                    重設密碼
                  </a>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default LoginPage

