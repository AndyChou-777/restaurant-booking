package com.dineReserve.model.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 企業用戶的資料傳輸物件 (DTO)。
 * 包含商戶的基本資訊以及所擁有的餐廳列表。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BusinessUserDto {
	
    private Long id;
    private String email; // 企業用戶的電子郵件
    private String password; // 企業用戶的登入密碼
    private String businessName; // 商戶名稱
    private List<RestaurantDto> restaurants; // 商戶擁有的餐廳列表
    
}
