package com.dineReserve.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantImageDTO {

	private Long id;  // 圖片 ID
    private String imageBase64;  // 圖片內容（Base64 格式）
    
}
