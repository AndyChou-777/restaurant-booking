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
public class ReservationDto {
	
    private Long id;
    private Long userId; // 預約用戶的 ID
    private Long restaurantId; // 餐廳的 ID
    private LocalDateTime reservationTime; // 預約的時間
    private Integer numberOfPeople; // 預約的人數
    private String status; // 預約的狀態（例如「成功」、「取消」）
    
}
