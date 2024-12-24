package com.dineReserve.model.entity;

import java.time.LocalDate;
import java.time.LocalTime;
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
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;

@Data
@Entity
@Table(name = "restaurant_availabilities")
public class RestaurantAvailability {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @Column(nullable = false)
    private LocalDate startDate;  // 改用 LocalDate 代替 Date

    @Column(nullable = false)
    private LocalDate endDate;    // 新增結束日期

    @Column(nullable = false)
    private LocalTime startTime;  // 每天的開始時間

    @Column(nullable = false)
    private LocalTime endTime;    // 每天的結束時間

    @Override
    public String toString() {
        return "RestaurantAvailability [id=" + id + 
               ", startDate=" + startDate + 
               ", endDate=" + endDate + 
               ", startTime=" + startTime + 
               ", endTime=" + endTime + "]";
    }

}
