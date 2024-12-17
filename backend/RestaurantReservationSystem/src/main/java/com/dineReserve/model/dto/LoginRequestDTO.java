package com.dineReserve.model.dto;

import lombok.Data;

/**
 * 用戶登入請求資料傳輸物件。
 */
@Data
public class LoginRequestDTO {

    @Email(message = "Please provide a valid email address")
    @NotEmpty(message = "Email cannot be empty")
    private String email; // 用戶電子郵件

    @NotEmpty(message = "Password cannot be empty")
    private String password; // 用戶密碼
}
