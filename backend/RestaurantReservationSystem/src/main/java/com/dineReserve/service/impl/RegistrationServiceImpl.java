package com.dineReserve.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dineReserve.enums.Role;
import com.dineReserve.exception.EmailAlreadyRegisteredException;
import com.dineReserve.model.dto.BusinessUserRegistrationDTO;
import com.dineReserve.model.dto.GeneralUserRegistrationDTO;
import com.dineReserve.model.entity.User;
import com.dineReserve.repository.UserRepository;
import com.dineReserve.service.RegistrationService;
import com.dineReserve.util.Hash;

@Service
public class RegistrationServiceImpl implements RegistrationService {

	@Autowired
    private UserRepository userRepository;

    @Override
    public void registerGeneralUser(GeneralUserRegistrationDTO generalUserDto) {
        // 確認 Email 是否已存在
        if (userRepository.existsByEmail(generalUserDto.getEmail())) {
            throw new EmailAlreadyRegisteredException();
        }

        // 使用 Hash 工具類產生鹽值和加密密碼
        String salt = Hash.getSalt();
        String hashedPassword = Hash.getHash(generalUserDto.getPassword(), salt);

        // 創建一般用戶
        User user = new User();
        user.setEmail(generalUserDto.getEmail());
        user.setPasswordHash(hashedPassword);
        user.setSalt(salt);
        user.setUsername(generalUserDto.getUsername());
        user.setRole(Role.GENERAL_USER);

        // 保存用戶到數據庫
        userRepository.save(user);
    }

    @Override
    public void registerBusinessUser(BusinessUserRegistrationDTO businessUserDto) {
        // 確認 Email 是否已存在
        if (userRepository.existsByEmail(businessUserDto.getEmail())) {
            throw new IllegalArgumentException("電子郵件已被註冊");
        }

        // 使用 Hash 工具類產生鹽值和加密密碼
        String salt = Hash.getSalt();
        String hashedPassword = Hash.getHash(businessUserDto.getPassword(), salt);

        // 創建商業用戶
        User user = new User();
        user.setEmail(businessUserDto.getEmail());
        user.setPasswordHash(hashedPassword);
        user.setSalt(salt);
        user.setUsername(businessUserDto.getBusinessName()); // 使用商戶名稱作為用戶名
        user.setRole(Role.BUSINESS_USER);

        // 保存用戶到數據庫
        userRepository.save(user);
    }
    
}

