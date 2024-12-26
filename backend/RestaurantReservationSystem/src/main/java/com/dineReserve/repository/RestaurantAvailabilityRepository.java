package com.dineReserve.repository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.dineReserve.model.entity.RestaurantAvailability;
import com.dineReserve.model.entity.RestaurantTag;

@Repository
public interface RestaurantAvailabilityRepository extends JpaRepository<RestaurantAvailability, Long>{

	// 查找指定日期範圍內的可用時間
    @Query("SELECT ra FROM RestaurantAvailability ra " +
           "WHERE ra.restaurant.id = :restaurantId " +
           "AND :date BETWEEN ra.startDate AND ra.endDate")
    List<RestaurantAvailability> findByRestaurantIdAndDate(Long restaurantId, LocalDate date);

    // 檢查日期範圍是否有重疊
    @Query("SELECT COUNT(ra) > 0 FROM RestaurantAvailability ra " +
           "WHERE ra.restaurant.id = :restaurantId " +
           "AND NOT (ra.endDate < :startDate OR ra.startDate > :endDate)")
    boolean hasOverlappingAvailability(Long restaurantId, LocalDate startDate, LocalDate endDate);
    
    // 獲取餐廳所有時段
    List<RestaurantAvailability> findByRestaurantIdOrderByStartDateAsc(Long restaurantId);
    
    // 檢查日期範圍是否有重疊（排除當前編輯的記錄）
    @Query("SELECT COUNT(ra) > 0 FROM RestaurantAvailability ra " +
           "WHERE ra.restaurant.id = :restaurantId " +
           "AND ra.id != :excludeId " +
           "AND NOT (ra.endDate < :startDate OR ra.startDate > :endDate)")
    boolean hasOverlappingAvailabilityExcluding(
        Long restaurantId, 
        LocalDate startDate, 
        LocalDate endDate, 
        Long excludeId
    );
	
    // 基於餐廳 ID 刪除標籤
    void deleteByRestaurantId(Long restaurantId);
    
}
