package com.dineReserve.model.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantAvailabilityDTO {
	
	private Long id;  // 可預約時間段 ID
    private String date;  // 可預約的日期（例如：2024-12-25）
    private List<String> timeSlots = new ArrayList<>();  // 可預約的時間段（例如：12:00 - 14:00）

}
