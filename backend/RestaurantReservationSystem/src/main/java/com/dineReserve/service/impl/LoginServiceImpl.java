package com.dineReserve.service.impl;

import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.dineReserve.exception.PasswordInvalidException;
import com.dineReserve.exception.UserNotFoundException;
import com.dineReserve.model.dto.LoginRequestDTO;
import com.dineReserve.model.dto.LoginResponseDTO;
import com.dineReserve.model.dto.UserDTO;
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
    private ModelMapper modelMapper;  

    // 登入邏輯
    public Optional<LoginResponseDTO> login(LoginRequestDTO loginRequestDto) {
    	
        // 根據 email 查找用戶
        Optional<User> optUser = userRepository.findByEmail(loginRequestDto.getEmail());
        
        // 檢查是否找到用戶
        if (optUser.isPresent()) {
            User user = optUser.get();

            // 驗證密碼（使用 Salt + Hash 的方法）
            boolean isPasswordValid = PasswordUtil.verifyPassword(loginRequestDto.getPassword(), user.getPasswordHash(), user.getSalt());

            if (isPasswordValid) {
                return Optional.of(modelMapper.map(user, LoginResponseDTO.class));
            }
        }

        // 密碼不正確或未找到用戶，返回空
        return Optional.empty();
    }
   
}
