package com.dineReserve.model.dto;

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
public class RestaurantDto {
	
    private Long id;
    private String name; // 餐廳名稱
    private String address; // 餐廳地址
    private Double averageSpending; // 餐廳的平均消費金額
    private List<String> tags; // 餐廳的標籤（例如「日式」、「韓式」）
    private String imageBase64; // 餐廳的圖片（Base64 格式）
    private Map<String, List<String>> availableTimes; // 可預約時間（日期 -> 時間段）
    
}
