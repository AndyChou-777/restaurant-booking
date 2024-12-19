package com.dineReserve.exception;

//自定義註冊信箱已存在錯誤例外

public class EmailAlreadyRegisteredException extends RuntimeException{
	
	public EmailAlreadyRegisteredException() {
        super();
    }
	
	public EmailAlreadyRegisteredException(String message) {
        super(message);
    }

}
