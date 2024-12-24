package com.dineReserve.model.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityDTO {
	
	@NotNull(message = "餐廳 ID 不能為空")
    private Long restaurantId;

    @NotNull(message = "開始日期不能為空")
    @PastOrPresent(message = "開始日期不能為未來日期")
    private LocalDate startDate;

    @NotNull(message = "結束日期不能為空")
    @FutureOrPresent(message = "結束日期不能為過去日期")
    private LocalDate endDate;

    @NotNull(message = "開始時間不能為空")
    private LocalTime startTime;

    @NotNull(message = "結束時間不能為空")
    private LocalTime endTime;

}
