package com.dineReserve.model.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 預約的資料傳輸物件 (DTO)。
 * 包含預約時間、人數、狀態及相關用戶與餐廳的資訊。
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDTO {
	
	private Long id;  // 預約 ID
    private UserDTO user;  // 預約的用戶
    private RestaurantDTO restaurant;  // 預約的餐廳
    private LocalDateTime reservationTime;  // 預約時間
    private Integer numberOfPeople;  // 預約人數
    private String status;  // 預約狀態
    
}
