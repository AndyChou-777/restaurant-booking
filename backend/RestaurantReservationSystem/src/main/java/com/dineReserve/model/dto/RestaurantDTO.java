package com.dineReserve.model.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 餐廳的資料傳輸物件 (DTO)。
 * 包含餐廳的基本資訊與可預約時間。
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantDTO {
	
	private Long id;  // 餐廳 ID
    private String name;  // 餐廳名稱
    private String address;  // 餐廳地址
    private Double averageSpending;  // 餐廳的平均消費金額
    private String imageBase64;  // 餐廳圖片（以 Base64 格式儲存）
    private UserDTO owner;  // 餐廳擁有者（商戶）

    private List<RestaurantTagDTO> tags = new ArrayList<>();  // 餐廳標籤
    private List<RestaurantAvailabilityDTO> availabilities = new ArrayList<>();  // 餐廳可預約時間段
    
}
