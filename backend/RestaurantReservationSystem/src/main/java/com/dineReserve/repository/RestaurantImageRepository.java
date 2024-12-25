package com.dineReserve.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dineReserve.model.entity.RestaurantImage;

@Repository
public interface RestaurantImageRepository extends JpaRepository<RestaurantImage, Long>{

}
