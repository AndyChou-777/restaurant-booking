package com.dineReserve.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dineReserve.aop.CheckUserSession;
import com.dineReserve.model.dto.AvailabilityDTO;
import com.dineReserve.response.ApiResponse;
import com.dineReserve.service.RestaurantService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/restaurants/{restaurantId}/availabilities")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RestaurantAvailabilityController {
    
	@Autowired
    private RestaurantService restaurantService;

    @GetMapping
    @CheckUserSession
    public ResponseEntity<ApiResponse<List<AvailabilityDTO>>> getAllAvailabilities(
            @PathVariable Long restaurantId) {
        List<AvailabilityDTO> availabilities = restaurantService.getRestaurantAllAvailabilities(restaurantId);
        return ResponseEntity.ok(ApiResponse.success("預約時間讀取成功!", availabilities));
    }

    @PostMapping
    @CheckUserSession
    public ResponseEntity<ApiResponse<Void>> addAvailability(
            @PathVariable Long restaurantId,
            @Valid @RequestBody AvailabilityDTO availabilityDTO) {
        availabilityDTO.setRestaurantId(restaurantId);
        restaurantService.addAvailability(availabilityDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(ApiResponse.success("可預約時間設定成功", null));
    }

    @PutMapping("/{availabilityId}")
    @CheckUserSession
    public ResponseEntity<ApiResponse<Void>> updateAvailability(
            @PathVariable Long restaurantId,
            @PathVariable Long availabilityId,
            @Valid @RequestBody AvailabilityDTO availabilityDTO) {
        availabilityDTO.setRestaurantId(restaurantId);
        restaurantService.updateAvailability(availabilityId, availabilityDTO);
        return ResponseEntity.ok(ApiResponse.success("可預約時間更新成功", null));
    }

    @DeleteMapping("/{availabilityId}")
    @CheckUserSession
    public ResponseEntity<ApiResponse<Void>> deleteAvailability(
            @PathVariable Long restaurantId,
            @PathVariable Long availabilityId) {
        restaurantService.deleteAvailability(availabilityId);
        return ResponseEntity.noContent().build();  // 沒有資料返回時可以使用此方式
    }
}
