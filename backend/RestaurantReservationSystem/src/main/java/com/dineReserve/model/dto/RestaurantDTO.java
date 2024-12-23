package com.dineReserve.model.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 餐廳的資料傳輸物件 (DTO)。
 * 包含餐廳的基本資訊與可預約時間。
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RestaurantDTO {
	
	private Long id;
    private String name;
    private String address;
    private Double averageSpending;
    private List<String> imageBase64List;
    private List<String> tags;
    
}
