package com.dineReserve.model.dto;

import com.dineReserve.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 用戶登入成功後的回應資料傳輸物件。
 */

@Data
public class LoginResponseDTO {

    private Long id; // 用戶 ID
    private String email; // 用戶電子郵件
    private String username; // 用戶名稱
    private Role role; // 用戶角色（如商業用戶或一般用戶）

    public LoginResponseDTO(Long id, String email, String username, Role role) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.role = role;
    }
}
