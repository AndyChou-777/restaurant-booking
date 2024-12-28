package com.dineReserve.model.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.dineReserve.enums.Statu;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
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
    
    private Long userId;
    
    @NotNull(message = "預約日期不能為空")
    @FutureOrPresent(message = "預約日期必須是今天或未來的日期")
    private LocalDate reservationDate;
    
    @NotNull(message = "預約時間不能為空")
    @Future(message = "預約時間必須為未來的時間")
    private LocalTime reservationTime;
    
    @NotNull(message = "人數不能為空")
    @Min(value = 1, message = "人數必須至少為 1")
    private Integer numberOfPeople;
    
    private Statu status;
    
}
