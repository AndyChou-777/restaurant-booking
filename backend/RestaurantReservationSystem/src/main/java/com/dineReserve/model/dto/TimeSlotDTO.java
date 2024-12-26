package com.dineReserve.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TimeSlotDTO {
	
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

