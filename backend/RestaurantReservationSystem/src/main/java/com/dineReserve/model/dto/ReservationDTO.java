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
	
	private Long id;
    private Long restaurantId;
    private Long userId;
    private LocalDateTime reservationTime;
    private Integer numberOfPeople;
    private String status;
    
}
