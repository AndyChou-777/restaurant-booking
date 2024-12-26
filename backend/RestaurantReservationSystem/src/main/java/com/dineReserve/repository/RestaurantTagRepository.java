package com.dineReserve.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dineReserve.model.entity.Restaurant;
import com.dineReserve.model.entity.RestaurantTag;

@Repository
public interface RestaurantTagRepository extends JpaRepository<RestaurantTag, Long>{

	// 根據 id 搜索 Tags
    List<RestaurantTag> findByRestaurantId(Long restaurantId);
	
}
