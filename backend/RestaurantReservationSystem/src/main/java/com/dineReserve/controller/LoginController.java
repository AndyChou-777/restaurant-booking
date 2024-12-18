package com.dineReserve.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dineReserve.model.dto.LoginRequestDTO;
import com.dineReserve.model.dto.LoginResponseDTO;
import com.dineReserve.service.LoginService;

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
public class LoginController {

    @Autowired
    private LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid LoginRequestDTO loginRequestDto) {
        try {
            LoginResponseDTO responseDto = loginService.login(loginRequestDto);
            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        loginService.logout();
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); // 無內容的成功響應
    }
}
