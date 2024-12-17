package com.dineReserve.model.dto;

import java.util.List;

import com.dineReserve.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

	private Long id;  // 用戶 ID
    private String email;  // 電子信箱
    private String username;  // 用戶名
    private Role role;  // 用戶角色
    private String phoneNumber;  // 電話號碼（如果有的話）

    private List<ReservationDTO> reservations;  // 用戶預約列表
    private List<RestaurantDTO> restaurants;  // 企業用戶的餐廳列表（如果是企業用戶）

}
