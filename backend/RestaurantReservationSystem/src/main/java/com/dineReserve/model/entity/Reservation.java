package com.dineReserve.model.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.dineReserve.enums.Role;
import com.dineReserve.enums.Statu;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

/**
 * 用於表示餐廳的預約，包括預約時間、狀態及相關用戶與餐廳。
 */

@Data
@Entity
@Table(name = "reservations")
public class Reservation {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 預約的用戶。 */
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** 預約的餐廳。 */
    @ManyToOne
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    /** 預約的日期。 */
    @Column(nullable = false)
    private LocalDate reservationDate;

    /** 預約的時間。 */
    @Column(nullable = false)
    private LocalTime reservationTime;

    /** 預約的人數。 */
    @Column(nullable = false)
    private Integer numberOfPeople;

    /** 預約的狀態。 */
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Statu status;

	@Override
	public String toString() {
		return "Reservation [id=" + id + ", reservationTime=" + reservationTime + ", numberOfPeople=" + numberOfPeople
				+ ", status=" + status + "]";
	}
    
}