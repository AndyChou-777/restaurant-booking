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
import jakarta.validation.constraints.Size;
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
public class UserReservationDTO {
	
	private Long id; // 由系統生成，新增時可為空
    
    private Long restaurantId;
    
    private Long userId;
    
    private LocalDate reservationDate;
    
    private LocalTime reservationTime;
    
    private Integer numberOfPeople;
    
    private Statu status;
    
    private String name;

    private String address;
    
}
