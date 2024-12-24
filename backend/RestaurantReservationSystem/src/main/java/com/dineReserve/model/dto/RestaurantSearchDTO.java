package com.dineReserve.model.dto;

import java.util.List;

import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RestaurantSearchDTO {

	private String keyword;
	
	@PositiveOrZero(message = "最低價格必須為正數或零")
    private Double minPrice;
	
	@PositiveOrZero(message = "最高價格必須為正數或零")
    private Double maxPrice;
	
    private List<String> tags;
	
}
