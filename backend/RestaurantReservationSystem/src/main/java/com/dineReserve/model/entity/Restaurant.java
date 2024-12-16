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

/**
 * 用於表示餐廳，包含其基本資訊、標籤與可預約時間。
 */
@Entity
@Table(name = "restaurants")
public class Restaurant {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 餐廳名稱。 */
    @Column(nullable = false)
    private String name;

    /** 餐廳地址。 */
    @Column(nullable = false)
    private String address;

    /** 餐廳的平均消費金額。 */
    @Column(nullable = false)
    private Double averageSpending;

    /** 餐廳的標籤，例如「日式」、「韓式」。 */
    @ElementCollection
    private List<String> tags = new ArrayList<>();

    /** 餐廳的圖片（以 Base64 格式儲存）。 */
    @Lob
    private String imageBase64;

    /** 餐廳的可預約時間段（日期 -> 時間段）。 */
    @ElementCollection
    @MapKeyColumn(name = "date")
    @Column(name = "time_slots")
    private Map<String, List<String>> availableTimes = new HashMap<>();

    /** 該餐廳的擁有者（商戶）。 */
    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private BusinessUser owner;

    /** 該餐廳的所有預約列表。 */
    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reservation> reservations = new ArrayList<>();
    
}