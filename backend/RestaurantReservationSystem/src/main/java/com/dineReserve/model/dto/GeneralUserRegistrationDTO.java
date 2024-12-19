package com.dineReserve.model.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class GeneralUserRegistrationDTO {
	
    @NotBlank
    @Email
    private String email; // 一般用戶的電子郵件

    @NotBlank
    @Size(min = 8, message = "請至少輸入 8 位數密碼!")
    private String password; // 密碼

    @NotBlank
    private String username; // 用戶名
    
}

