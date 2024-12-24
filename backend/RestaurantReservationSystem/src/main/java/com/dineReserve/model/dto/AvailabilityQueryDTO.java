package com.dineReserve.model.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AvailabilityQueryDTO {

	private Long restaurantId;
    private LocalDate date;
	
}
