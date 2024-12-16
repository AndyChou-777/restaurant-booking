package com.dineReserve.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 一般用戶的資料傳輸物件 (DTO)。
 * 包含用戶登入所需的基本資訊。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeneralUserDto {
	
    private Long id;
    private String email; // 用戶的電子郵件
    private String password; // 用戶的登入密碼
    
}
