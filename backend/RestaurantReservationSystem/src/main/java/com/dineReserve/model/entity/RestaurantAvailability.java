package com.dineReserve.model.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "restaurant_availabilities")
public class RestaurantAvailability {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;  // 這個可預約時間段所屬的餐廳

    @Column(nullable = false)
    private String date;  // 可預約的日期（例如：2024-12-25）

    @ElementCollection
    @Column(name = "time_slots")
    private List<String> timeSlots = new ArrayList<>();  // 可預約的時間段（例如：12:00 - 14:00）

}
