package com.dineReserve.model.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
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
	
	private Long id; // 由系統生成，新增時可為空
    
    @NotNull(message = "餐廳 ID 不能為空")
    private Long restaurantId;
    
    @NotNull(message = "用戶 ID 不能為空")
    private Long userId;
    
    @NotNull(message = "預約時間不能為空")
    @Future(message = "預約時間必須為未來的時間")
    private LocalDateTime reservationTime;
    
    @NotNull(message = "人數不能為空")
    @Min(value = 1, message = "人數必須至少為 1")
    private Integer numberOfPeople;
    
    @NotBlank(message = "預約狀態不能為空")
    @Pattern(regexp = "^(PENDING|CONFIRMED|CANCELLED)$", message = "預約狀態只能是 PENDING, CONFIRMED 或 CANCELLED")
    private String status;
    
}
