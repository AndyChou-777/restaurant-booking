package com.dineReserve.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dineReserve.model.entity.RestaurantTag;

@Repository
public interface RestaurantTagRepository extends JpaRepository<RestaurantTag, Long>{
	
	// 基於餐廳 ID 刪除標籤
    void deleteByRestaurantId(Long restaurantId);
	
}
