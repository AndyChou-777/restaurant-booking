package com.dineReserve.controller;

import java.util.Optional;

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
import com.dineReserve.model.dto.UserDTO;
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
    public ResponseEntity<ApiResponse<LoginResponseDTO>> login(@RequestBody @Valid LoginRequestDTO loginRequestDto, HttpSession session) {
               	    	
        	// login 判斷比對
        	Optional<LoginResponseDTO> optLoginDto = loginService.login(loginRequestDto);
        	
        	if (optLoginDto.isEmpty()) {
				return ResponseEntity.status(404).body(ApiResponse.error(404, "登入失敗"));
			}
        	
        	// 存入 HttpSession 中
        	session.setAttribute("loginDTO", optLoginDto.get());
        	LoginResponseDTO loginResponseDTO = optLoginDto.get();
        	
        	return ResponseEntity.ok(ApiResponse.success("登入成功", loginResponseDTO));
    }

    @GetMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(HttpSession session) {
    	session.invalidate(); // session 失效
        return ResponseEntity.ok(ApiResponse.success("登出結果", "登出成功"));
    }
    
    @GetMapping("/session")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> checkSession(HttpSession session) {
        
    	LoginResponseDTO loginResponseDTO = (LoginResponseDTO) session.getAttribute("loginDTO");
    	
    	if (loginResponseDTO == null) {
            return ResponseEntity.ok(ApiResponse.success("登入失敗", null));
        } 

    	return ResponseEntity.ok(ApiResponse.success("登入成功", loginResponseDTO));
    }
    
}
