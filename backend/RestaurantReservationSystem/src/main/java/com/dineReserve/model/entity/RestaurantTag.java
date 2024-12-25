package com.dineReserve.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "restaurant_tags")
public class RestaurantTag {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;  // 這個標籤所屬的餐廳

    @Column(nullable = false)
    private String tag;  // 單一標籤（例如日式、韓式）

	@Override
	public String toString() {
		return "RestaurantTag [id=" + id + ", tag=" + tag + "]";
	}

}
