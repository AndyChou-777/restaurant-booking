package com.dineReserve.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dineReserve.aop.CheckUserSession;
import com.dineReserve.model.dto.RestaurantDTO;
import com.dineReserve.model.dto.RestaurantSearchDTO;
import com.dineReserve.response.ApiResponse;
import com.dineReserve.service.RestaurantService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RestaurantController {
	
	@Autowired
    private RestaurantService restaurantService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<RestaurantDTO>> createRestaurant(@Valid @RequestBody RestaurantDTO restaurantDTO) {
        RestaurantDTO createdRestaurant = restaurantService.createRestaurant(restaurantDTO);
        return ResponseEntity.ok(ApiResponse.success("餐廳建立成功!", createdRestaurant));
    }

    @PutMapping("/restaurants/{id}")
    @CheckUserSession
    public ResponseEntity<ApiResponse<RestaurantDTO>> updateRestaurant(
    		@PathVariable Long id,
    		@Valid @RequestBody RestaurantDTO restaurantDTO) {
        RestaurantDTO updatedRestaurant = restaurantService.updateRestaurant(id, restaurantDTO);
        return ResponseEntity.ok(ApiResponse.success("餐廳更新成功!", updatedRestaurant));
    }

    @DeleteMapping("/restaurants/{id}")
    @CheckUserSession
    public ResponseEntity<ApiResponse<Void>> deleteRestaurant(@PathVariable Long id) {
        restaurantService.deleteRestaurant(id);
        return ResponseEntity.ok(ApiResponse.success("餐廳刪除成功!", null));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<List<RestaurantDTO>>> searchRestaurants(
           @Valid @RequestBody(required = false) RestaurantSearchDTO searchDTO) {
        // 確保 DTO 不為空
        if (searchDTO == null) {
            searchDTO = new RestaurantSearchDTO();
        }
        List<RestaurantDTO> restaurants = restaurantService.searchRestaurants(searchDTO);
        return ResponseEntity.ok(ApiResponse.success("餐廳搜索成功!", restaurants));
    }
    
}
