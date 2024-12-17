package com.dineReserve.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dineReserve.model.entity.RestaurantAvailability;

@Repository
public interface RestaurantAvailabilityRepository extends JpaRepository<RestaurantAvailability, Long>{

}
