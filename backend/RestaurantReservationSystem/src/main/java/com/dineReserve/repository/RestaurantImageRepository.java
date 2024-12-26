package com.dineReserve.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dineReserve.model.entity.RestaurantImage;
import com.dineReserve.model.entity.RestaurantTag;

@Repository
public interface RestaurantImageRepository extends JpaRepository<RestaurantImage, Long>{

	// 基於餐廳 ID 刪除標籤
    void deleteByRestaurantId(Long restaurantId);
	
}
