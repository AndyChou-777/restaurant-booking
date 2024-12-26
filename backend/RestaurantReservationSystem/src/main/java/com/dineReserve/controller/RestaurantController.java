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
import com.dineReserve.model.dto.LoginResponseDTO;
import com.dineReserve.model.dto.RestaurantDTO;
import com.dineReserve.model.dto.RestaurantSearchDTO;
import com.dineReserve.response.ApiResponse;
import com.dineReserve.service.RestaurantService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RestaurantController {
	
	@Autowired
    private RestaurantService restaurantService;

    @PostMapping("/create")
    @CheckUserSession
    public ResponseEntity<ApiResponse<RestaurantDTO>> createRestaurant(
    		@Valid @RequestBody RestaurantDTO restaurantDTO,
    		HttpSession session) {
    	
    	LoginResponseDTO responseDTO = (LoginResponseDTO) session.getAttribute("loginDTO");
    	
    	System.out.println("獲得 Session 成功: " + responseDTO);
    	
    	Long userId = responseDTO.getId();
    	
    	System.out.println("獲得 UserId 成功: " + userId);
        RestaurantDTO createdRestaurant = restaurantService.createRestaurant(userId, restaurantDTO);
        return ResponseEntity.ok(ApiResponse.success("餐廳建立成功", createdRestaurant));
    }

    @PutMapping("/restaurants/{id}")
    @CheckUserSession
    public ResponseEntity<ApiResponse<RestaurantDTO>> updateRestaurant(
    		@PathVariable Long id,
    		@Valid @RequestBody RestaurantDTO restaurantDTO) {
        RestaurantDTO updatedRestaurant = restaurantService.updateRestaurant(id, restaurantDTO);
        return ResponseEntity.ok(ApiResponse.success("餐廳更新成功", updatedRestaurant));
    }

    @DeleteMapping("/restaurants/{id}")
    @CheckUserSession
    public ResponseEntity<ApiResponse<Void>> deleteRestaurant(@PathVariable Long id) {
        restaurantService.deleteRestaurant(id);
        return ResponseEntity.ok(ApiResponse.success("餐廳刪除成功", null));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<List<RestaurantDTO>>> searchRestaurants(
           @Valid @RequestBody(required = false) RestaurantSearchDTO searchDTO) {
        // 確保 DTO 不為空
        if (searchDTO == null) {
            searchDTO = new RestaurantSearchDTO();
        }
        List<RestaurantDTO> restaurants = restaurantService.searchRestaurants(searchDTO);
        return ResponseEntity.ok(ApiResponse.success("餐廳搜索成功", restaurants));
    }
    
    @GetMapping
    @CheckUserSession
    public ResponseEntity<ApiResponse<List<RestaurantDTO>>> findAllRestuarants(){
    	List<RestaurantDTO> restaurantDTO = restaurantService.getAllRestaurants();
    	return ResponseEntity.ok(ApiResponse.success("餐廳獲取成功", restaurantDTO));
    }
    
    @GetMapping("/search")
    @CheckUserSession
    public ResponseEntity<ApiResponse<List<RestaurantDTO>>> findRestuarantsById(HttpSession session){
    	
    	LoginResponseDTO loginResponseDTO = (LoginResponseDTO) session.getAttribute("loginDTO");
    	Long id = loginResponseDTO.getId();
    	List<RestaurantDTO> restaurantDTO = restaurantService.getRestaurantsById(id);
    	System.out.println(restaurantDTO);
    	return ResponseEntity.ok(ApiResponse.success("旗下餐廳獲取成功", restaurantDTO));
    	
    }
    
}
