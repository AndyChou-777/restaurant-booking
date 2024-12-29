package com.dineReserve.controller;

import java.time.LocalDate;
import java.time.LocalTime;
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
import org.springframework.web.bind.annotation.RestController;

import com.dineReserve.aop.CheckUserSession;
import com.dineReserve.model.dto.LoginResponseDTO;
import com.dineReserve.model.dto.ReservationDTO;
import com.dineReserve.model.dto.UserReservationDTO;
import com.dineReserve.response.ApiResponse;
import com.dineReserve.service.RestaurantService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ReservationController {
	
	@Autowired
    private RestaurantService restaurantService;

    @PostMapping
    @CheckUserSession
    public ResponseEntity<ApiResponse<ReservationDTO>> createReservation(
    		HttpSession session,
    		@Valid @RequestBody ReservationDTO reservationDTO) {
    	LoginResponseDTO responseDTO = (LoginResponseDTO) session.getAttribute("loginDTO");
    	System.out.print("收到的預約資料: " + reservationDTO);
        ReservationDTO createdReservation = restaurantService.createReservation(responseDTO.getId(), reservationDTO);
        System.out.print("返回的建立資料: " + createdReservation);
        return ResponseEntity.ok(ApiResponse.success("預約建立成功", createdReservation));
    }
    
    @GetMapping("/{restaurantId}/{date}")
    public ResponseEntity<ApiResponse<List<String>>> getAvailableTimeSlots(
        @PathVariable Long restaurantId,
        @PathVariable LocalDate date) {
    	System.out.print("收到的日期: " + date);
        List<String> availableTimes = restaurantService.getAvailableTimeSlots(restaurantId, date);
        System.out.print("返回的時間陣列: " + availableTimes);
        return ResponseEntity.ok(ApiResponse.success("可用時段獲取成功", availableTimes));
    }

    @PutMapping("/reservation/{id}")
    @CheckUserSession
    public ResponseEntity<ApiResponse<ReservationDTO>> updateReservation(
            @PathVariable Long id,
            @Valid @RequestBody ReservationDTO reservationDTO) {
    	System.out.print("收到的預約: " + reservationDTO);
        ReservationDTO updatedReservation = restaurantService.updateReservation(id, reservationDTO);
        System.out.print("返回的預約: " + updatedReservation);
        return ResponseEntity.ok(ApiResponse.success("預約更新成功!", updatedReservation));
    }

    @DeleteMapping("/reservation/{id}")
    @CheckUserSession
    public ResponseEntity<ApiResponse<Void>> cancelReservation(@PathVariable Long id) {
        restaurantService.cancelReservation(id);
        return ResponseEntity.ok(ApiResponse.success("預約取消成功!", null));
    }
    
    @GetMapping("/finish/{id}")
    @CheckUserSession
    public ResponseEntity<ApiResponse<Void>> finishReservation(@PathVariable Long id) {
        restaurantService.finishReservation(id);
        return ResponseEntity.ok(ApiResponse.success("預約成功報到", null));
    }

    @GetMapping("/user")
    @CheckUserSession
    public ResponseEntity<ApiResponse<List<UserReservationDTO>>> getUserReservations(
            HttpSession session) {
    	LoginResponseDTO loginResponseDTO = (LoginResponseDTO) session.getAttribute("loginDTO");
        List<UserReservationDTO> reservations = restaurantService.getUserReservations(loginResponseDTO.getId());
        return ResponseEntity.ok(ApiResponse.success("用戶預約清單查詢成功", reservations));
    }
    
    @GetMapping("/business")
    @CheckUserSession
    public ResponseEntity<ApiResponse<List<UserReservationDTO>>> getBusinessReservations(
            HttpSession session) {
    	LoginResponseDTO loginResponseDTO = (LoginResponseDTO) session.getAttribute("loginDTO");
        List<UserReservationDTO> reservations = restaurantService.getBusinessReservations(loginResponseDTO.getId());
        return ResponseEntity.ok(ApiResponse.success("用戶預約清單查詢成功", reservations));
    }
    
}
