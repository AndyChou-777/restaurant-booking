package com.dineReserve.model.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

/**
 * 用於表示企業用戶（商戶），可擁有多個餐廳。
 */
@Entity
@Table(name = "business_users")
public class BusinessUser {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 企業用戶的電子郵件地址，用於登入，需唯一。 */
    @Column(nullable = false, unique = true)
    private String email;

    /** 企業用戶的登入密碼，用於身份驗證。 */
    @Column(nullable = false)
    private String password;

    /** 商戶名稱，用於內部管理與識別。 */
    private String businessName;

    /** 該商戶所擁有的所有餐廳列表。 */
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Restaurant> restaurants = new ArrayList<>();
    
}
