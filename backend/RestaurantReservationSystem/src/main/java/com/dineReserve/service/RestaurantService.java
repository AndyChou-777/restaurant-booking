package com.dineReserve.service;

import java.util.Date;
import java.util.List;

import com.dineReserve.model.dto.ReservationDTO;
import com.dineReserve.model.dto.RestaurantDTO;
import com.dineReserve.model.dto.RestaurantSearchDTO;
import com.dineReserve.model.entity.RestaurantAvailability;

public interface RestaurantService {

	// 餐廳管理
    RestaurantDTO createRestaurant(RestaurantDTO restaurantDTO);
    RestaurantDTO updateRestaurant(Long id, RestaurantDTO restaurantDTO);
    void deleteRestaurant(Long id);
    
    // 搜索功能
    List<RestaurantDTO> searchRestaurants(RestaurantSearchDTO searchDTO);
    List<RestaurantDTO> getAllRestaurants();
    
    // 預約管理
    ReservationDTO createReservation(ReservationDTO reservationDTO);
    ReservationDTO updateReservation(Long id, ReservationDTO reservationDTO);
    void cancelReservation(Long id);
    List<ReservationDTO> getUserReservations(Long userId);
    
    // 可用時間管理
    void addAvailability(RestaurantAvailability availabilityDTO);
    List<RestaurantAvailability> getAvailability(Long restaurantId, Date date);
	
}