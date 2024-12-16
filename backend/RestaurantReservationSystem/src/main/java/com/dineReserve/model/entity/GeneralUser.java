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
 * 用於表示系統中的一般用戶。
 * 包括用戶登入所需的基本資料以及預約管理。
 */
@Entity
@Table(name = "general_users")
public class GeneralUser {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 用戶的電子郵件地址，用於登入，需唯一。 */
    @Column(nullable = false, unique = true)
    private String email;

    /** 用戶的登入密碼，用於身份驗證。 */
    @Column(nullable = false)
    private String password;

    /** 該用戶所創建的所有預約列表。 */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reservation> reservations = new ArrayList<>();
    
}
