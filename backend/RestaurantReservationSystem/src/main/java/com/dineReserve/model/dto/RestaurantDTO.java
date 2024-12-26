package com.dineReserve.model.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
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

    @NotBlank(message = "餐廳名稱不可為空")
    @Size(max = 20, message = "餐廳名稱長度不可超過20字")
    private String name;

    @NotBlank(message = "餐廳地址不可為空")
    @Size(max = 50, message = "餐廳地址長度不可超過50字")
    private String address;
    
    @NotBlank(message = "餐廳描述不可為空")
    @Size(max = 100, message = "餐廳描述長度不可超過100字")
    private String description;

    @NotNull(message = "平均消費不可為空")
    @Positive(message = "平均消費必須為正數")
    private Double averageSpending;

    @Size(max = 4, message = "圖片數量不可超過4張")
    private List<@NotBlank(message = "至少需要有一張圖片") String> imageBase64List;

    @Size(max = 5, message = "標籤數量不可超過5個")
    private List<String> tags;
    
    @NotNull(message = "時間段不能為空")
    @Size(min = 1, message = "至少需要有一個時間段")
    private List<TimeSlotDTO> timeSlots;
    
}
