package com.dineReserve.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "restaurant_images")
public class RestaurantImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // 圖片 ID

    @Lob
    @Column(nullable = false)
    private String imageBase64;  // 圖片內容（以 Base64 格式儲存）

    @ManyToOne
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;  // 關聯的餐廳

	@Override
	public String toString() {
		return "RestaurantImage [id=" + id + ", imageBase64=" + imageBase64 + "]";
	}

}
