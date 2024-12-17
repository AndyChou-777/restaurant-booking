package com.dineReserve.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RestaurantTagDTO {
	
	private Long id;  // 標籤 ID
    private String tag;  // 標籤內容（例如：日式、韓式）

}
