package com.dineReserve.model.entity;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

/**
 * 用於表示餐廳，包含其基本資訊、標籤與可預約時間。
 */

@Data
@Entity
@Table(name = "restaurants")
public class Restaurant {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;  // 餐廳名稱

    @Column(nullable = false)
    private String address;  // 餐廳地址

    @Column(nullable = false)
    private Double averageSpending;  // 餐廳的平均消費金額

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RestaurantImage> images = new ArrayList<>();  // 餐廳的多張圖片

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;  // 餐廳的擁有者（商戶）

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reservation> reservations = new ArrayList<>();  // 餐廳的所有預約列表

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RestaurantTag> tags = new ArrayList<>();  // 餐廳標籤

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RestaurantAvailability> availabilities = new ArrayList<>();  // 餐廳的可預約時間
    
}