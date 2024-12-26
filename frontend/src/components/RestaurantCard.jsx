import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit, Trash2, Clock, Image } from 'lucide-react';

// 預設餐廳資料結構
const defaultRestaurant = {
  id: '',
  name: '',
  address: '',
  introduction: '',
  imageBase64List: [],
  tags: [],
  hours: {
    morning: '',
    evening: ''
  },
  startDate: '',
  endDate: '',
  averageSpending: 0
};

const RestaurantCard = ({ restaurant = defaultRestaurant, onEdit = () => {}, onDelete = () => {} }) => (
  <div key={restaurant?.id || 'default'} className="border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className="grid grid-cols-12 gap-4 p-4">
      {/* 餐廳圖片區域 */}
      <div className="col-span-2">
        {restaurant?.imageBase64List?.[0] ? (
          <img 
            src={restaurant.imageBase64List[0]}
            alt={restaurant.name}
            className="w-full h-28 object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-28 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
      </div>

      {/* 基本信息區域 */}
      <div className="col-span-7">
        <div className="flex flex-col h-full justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{restaurant?.name || 'Untitled Restaurant'}</h3>
            <p className="text-sm text-gray-600 mb-1">{restaurant?.address || 'No address provided'}</p>
            <p className="text-sm text-gray-700 mb-2 line-clamp-2">{restaurant?.introduction || 'No description available'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {restaurant?.tags?.map((tag, index) => (
              <span key={index} className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 營業資訊區域 */}
      <div className="col-span-3">
        <div className="h-full flex flex-col justify-between">
          <div>
            <div className="text-sm font-medium text-gray-900 mb-1">
              預約期間: <span className="text-gray-600">{restaurant?.startDate || 'N/A'} ~ {restaurant?.endDate || 'N/A'}</span>
            </div>
            <div className="text-sm font-medium text-gray-900 mb-1">
              營業時間: <span className="text-gray-600">{restaurant?.hours?.morning || 'N/A'} ~ {restaurant?.hours?.evening || 'N/A'}</span>
            </div>
            <div className="text-sm font-medium text-gray-900">
              平均消費: <span className="text-gray-600">${restaurant?.averageSpending || 0}</span>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(restaurant, 'basic')} className="flex-1">
              <Edit className="h-4 w-4 mr-1" /> 編輯
            </Button>
            <Button variant="outline" size="sm" onClick={() => onEdit(restaurant, 'time')} className="px-2">
              <Clock className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onEdit(restaurant, 'image')} className="px-2">
              <Image className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(restaurant?.id)} className="px-2">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const EditBasicDialog = ({ restaurant = defaultRestaurant, onSave = () => {}, onClose = () => {} }) => (
  <Dialog open={true} onOpenChange={onClose}>
    <DialogContent className="bg-white max-w-2xl">
      <DialogHeader>
        <DialogTitle>編輯餐廳基本資料</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 mt-4">
        <div>
          <Label>餐廳名稱</Label>
          <Input value={restaurant?.name || ''} />
        </div>
        <div>
          <Label>餐廳地址</Label>
          <Input value={restaurant?.address || ''} />
        </div>
        <div>
          <Label>餐廳介紹</Label>
          <Textarea value={restaurant?.introduction || ''} />
        </div>
        <div>
          <Label>平均消費</Label>
          <Input type="number" value={restaurant?.averageSpending || 0} />
        </div>
        <div>
          <Label>標籤</Label>
          <Input 
            placeholder="請輸入標籤（以半形逗號分隔）"
            value={restaurant?.tags?.join(", ") || ''}
          />
        </div>
        <Button onClick={onSave} className="w-full">儲存變更</Button>
      </div>
    </DialogContent>
  </Dialog>
);

const EditTimeDialog = ({ restaurant = defaultRestaurant, onSave = () => {}, onClose = () => {} }) => (
  <Dialog open={true} onOpenChange={onClose}>
    <DialogContent className="bg-white">
      <DialogHeader>
        <DialogTitle>編輯預約時間</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>預約開始日期</Label>
            <Input type="date" value={restaurant?.startDate || ''} />
          </div>
          <div>
            <Label>預約結束日期</Label>
            <Input type="date" value={restaurant?.endDate || ''} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>營業開始時間</Label>
            <Input type="time" value={restaurant?.hours?.morning || ''} />
          </div>
          <div>
            <Label>營業結束時間</Label>
            <Input type="time" value={restaurant?.hours?.evening || ''} />
          </div>
        </div>
        <Button onClick={onSave} className="w-full">儲存變更</Button>
      </div>
    </DialogContent>
  </Dialog>
);

const EditImageDialog = ({ restaurant = defaultRestaurant, onSave = () => {}, onClose = () => {} }) => (
  <Dialog open={true} onOpenChange={onClose}>
    <DialogContent className="bg-white">
      <DialogHeader>
        <DialogTitle>編輯餐廳圖片</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          {restaurant?.imageBase64List?.map((image, index) => (
            <div key={index} className="relative">
              <img src={image} alt="" className="w-full h-40 object-cover rounded-lg" />
              <Button 
                variant="destructive" 
                size="sm" 
                className="absolute top-2 right-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <div>
          <Label>上傳新圖片</Label>
          <Input type="file" accept="image/*" multiple className="mt-2" />
        </div>
        <Button onClick={onSave} className="w-full">儲存變更</Button>
      </div>
    </DialogContent>
  </Dialog>
);

const RestaurantManagement = ({ restaurants = [] }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [editType, setEditType] = useState(null);

  const handleEdit = (restaurant, type) => {
    setSelectedRestaurant(restaurant);
    setEditType(type);
  };

  const handleSave = () => {
    // 實作儲存邏輯
    setSelectedRestaurant(null);
    setEditType(null);
  };

  const handleClose = () => {
    setSelectedRestaurant(null);
    setEditType(null);
  };

  return (
    <div className="space-y-4">
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant?.id}
          restaurant={restaurant}
          onEdit={handleEdit}
          onDelete={(id) => console.log('Delete restaurant:', id)}
        />
      ))}

      {selectedRestaurant && editType === 'basic' && (
        <EditBasicDialog
          restaurant={selectedRestaurant}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}

      {selectedRestaurant && editType === 'time' && (
        <EditTimeDialog
          restaurant={selectedRestaurant}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}

      {selectedRestaurant && editType === 'image' && (
        <EditImageDialog
          restaurant={selectedRestaurant}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default RestaurantManagement;