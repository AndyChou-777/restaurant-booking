package com.dineReserve.service;

import java.util.Optional;

import com.dineReserve.model.dto.LoginRequestDTO;
import com.dineReserve.model.dto.LoginResponseDTO;

public interface LoginService {

	public Optional<LoginResponseDTO> login(LoginRequestDTO loginRequestDto); // 登入邏輯 --> 找到用戶後用來回傳結果
	
}
