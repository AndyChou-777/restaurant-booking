package com.dineReserve.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dineReserve.model.entity.RestaurantAvailability;

@Repository
public interface RestaurantAvailabilityRepository extends JpaRepository<RestaurantAvailability, Long>{

	List<RestaurantAvailability> findByRestaurantIdAndDate(Long restaurantId, Date date);
	
}
