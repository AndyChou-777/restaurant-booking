package com.dineReserve.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dineReserve.model.entity.Reservation;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long>{

	List<Reservation> findByUserId(Long userId);
    List<Reservation> findByRestaurantId(Long restaurantId);
    Optional<Reservation> findByReservationDateAndReservationTime(
    	    LocalDate reservationDate, 
    	    LocalTime reservationTime
    	);
    
    List<Reservation> findByRestaurantIdAndReservationDate(
    		Long restaurantId,
    	    LocalDate reservationDate
    	);

}
