package com.dineReserve.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dineReserve.enums.Role;
import com.dineReserve.exception.EmailAlreadyRegisteredException;
import com.dineReserve.exception.PasswordInvalidException;
import com.dineReserve.exception.UserNotFoundException;
import com.dineReserve.model.dto.BusinessUserRegistrationDTO;
import com.dineReserve.model.dto.GeneralUserRegistrationDTO;
import com.dineReserve.model.dto.LoginRequestDTO;
import com.dineReserve.model.dto.LoginResponseDTO;
import com.dineReserve.response.ApiResponse;
import com.dineReserve.service.LoginService;
import com.dineReserve.service.RegistrationService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

/*
 * WEB REST API
 * ----------------------------------
 * Servlet-Path: /omotenashi
 * ----------------------------------
 * POST /login      登入
 * GET  /logout     登出
 * */

@RestController
@RequestMapping("/omotenashi")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    @Autowired
    private LoginService loginService;
    
    @Autowired
    private RegistrationService registrationService;
    
    @PostMapping("/register/general")
    public ResponseEntity<ApiResponse<GeneralUserRegistrationDTO>> registerGeneralUser(@RequestBody @Valid GeneralUserRegistrationDTO generalUserDto) {
        try {
            registrationService.registerGeneralUser(generalUserDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("一般用戶註冊成功!", generalUserDto));
        } catch (EmailAlreadyRegisteredException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiResponse.error(409, e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, e.getMessage()));
        }
    }

    @PostMapping("/register/business")
    public ResponseEntity<ApiResponse<BusinessUserRegistrationDTO>> registerBusinessUser(@RequestBody @Valid BusinessUserRegistrationDTO businessUserDto) {
        try {
            registrationService.registerBusinessUser(businessUserDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("商業用戶註冊成功!", businessUserDto));
        } catch (EmailAlreadyRegisteredException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiResponse.error(409, e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> login(@RequestBody @Valid LoginRequestDTO loginRequestDto) {
        try {
            LoginResponseDTO responseDto = loginService.login(loginRequestDto);
            return ResponseEntity.ok(ApiResponse.success("登入成功", responseDto));
        } catch (UserNotFoundException | PasswordInvalidException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error(401, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error(500, "系統錯誤，請稍後再試"));
        }
    }

    @GetMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout() {
        loginService.logout();
        return ResponseEntity.ok(ApiResponse.success("登出結果", "登出成功"));
    }
    
    @GetMapping("/session")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> checkSession(HttpSession session) {
        if (loginService.isUserLoggedIn()) {
        	
        	Long userId = (Long)session.getAttribute("userId");
        	String email = (String) session.getAttribute("email");
        	String username = (String) session.getAttribute("username");
        	Role role = (Role) session.getAttribute("role");
            
            LoginResponseDTO responseDto = new LoginResponseDTO(userId, email, username, role);

            return ResponseEntity.ok(ApiResponse.success("用戶已登入", responseDto));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(401, "用戶未登入"));
        }
    }
    
}
