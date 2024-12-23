package com.dineReserve.model.dto;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantAvailabilityDTO {
	
	private Long restaurantId;
    private Date date;
    private LocalTime startTime;
    private LocalTime endTime;

}
