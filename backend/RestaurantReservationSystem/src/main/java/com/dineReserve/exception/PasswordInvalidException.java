package com.dineReserve.exception;

// 自定義密碼錯誤例外
public class PasswordInvalidException extends RuntimeException{

	public PasswordInvalidException() {
		super();
	}
	
	public PasswordInvalidException(String message) {
		super(message);
	}

}
