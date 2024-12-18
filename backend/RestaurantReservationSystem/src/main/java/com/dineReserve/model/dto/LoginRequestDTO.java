package com.dineReserve.model.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

/**
 * 用戶登入請求資料傳輸物件。
 */
@Data
public class LoginRequestDTO {

    @Email(message = "請輸入有效的電子信箱!")
    @NotEmpty(message = "電子信箱欄位不可為空!")
    private String email; // 用戶電子郵件

    @NotEmpty(message = "密碼欄位不可為空!")
    private String password; // 用戶密碼
    
}
