package com.dineReserve.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.dineReserve.model.entity.Restaurant;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long>{

	// 模糊搜索餐廳
    @Query("SELECT r FROM Restaurant r WHERE " +
           "LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.address) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Restaurant> searchByKeyword(String keyword);

    // 根據標籤搜索餐廳
    @Query("SELECT DISTINCT r FROM Restaurant r JOIN r.tags t WHERE t.tag IN :tags")
    List<Restaurant> findByTags(List<String> tags);
	
}
