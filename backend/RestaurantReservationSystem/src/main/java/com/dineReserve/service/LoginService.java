package com.dineReserve.service;

import com.dineReserve.model.dto.LoginRequestDTO;
import com.dineReserve.model.dto.LoginResponseDTO;

public interface LoginService {

	public LoginResponseDTO login(LoginRequestDTO loginRequestDto); // 登入邏輯 --> 找到用戶後用來回傳結果
	
	public void logout(); // 登出邏輯 --> Session 清空
	
}
