package com.dineReserve.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.dineReserve.exception.PasswordInvalidException;
import com.dineReserve.exception.UserNotFoundException;
import com.dineReserve.model.dto.LoginRequestDTO;
import com.dineReserve.model.dto.LoginResponseDTO;
import com.dineReserve.model.entity.User;
import com.dineReserve.repository.UserRepository;
import com.dineReserve.service.LoginService;
import com.dineReserve.util.PasswordUtil;

import jakarta.servlet.http.HttpSession;

/**
 * 處理用戶登入的服務。
 */
@Service
public class LoginServiceImpl implements LoginService{

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private HttpSession session;

    // 登入邏輯
    public LoginResponseDTO login(LoginRequestDTO loginRequestDto) {
        // 根據 email 查找用戶
        User user = userRepository.findByEmail(loginRequestDto.getEmail())
                .orElseThrow(() -> new UserNotFoundException());

        // 驗證密碼（使用 Salt + Hash 的方法）
        boolean isPasswordValid = PasswordUtil.verifyPassword(loginRequestDto.getPassword(), user.getPasswordHash(), user.getSalt());
        if (!isPasswordValid) {
            throw new PasswordInvalidException();
        }

        // 儲存登入狀態到 Session
        HttpSession session = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest().getSession();
        session.setAttribute("userId", user.getId());
        session.setAttribute("username", user.getUsername());
        session.setAttribute("role", user.getRole());

        // 返回登入成功的資料
        return new LoginResponseDTO(user.getId(), user.getEmail(), user.getUsername(), user.getRole());
    }

    // 登出邏輯
    public void logout() {
        HttpSession session = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest().getSession(false);
        if (session != null) {
            session.invalidate(); // 銷毀 Session
        }
    }
    
    // 檢查登入狀態
    public boolean isUserLoggedIn() {
        // 假設用戶的 ID 被存儲在 Session 中，使用 "userId" 作為鍵
        return session.getAttribute("userId") != null;
    }
    
    
}
