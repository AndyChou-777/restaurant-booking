package com.dineReserve.exception;

import java.lang.reflect.UndeclaredThrowableException;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.dineReserve.response.ApiResponse;

@ControllerAdvice // 處理全域例外
public class GlobalExceptionHandler {

	@Autowired
	private MessageSource messageSource;
	
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiResponse<String>> handleException(Exception ex, Locale locale) {
		
		Throwable actualException = ex;
		
		if (ex instanceof UndeclaredThrowableException) {
			actualException = ((UndeclaredThrowableException)ex).getUndeclaredThrowable();
		}
		
		String message = null;
		HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
		
		if (ex instanceof UnauthorizedException) {
			message = ex.getMessage().isEmpty()? messageSource.getMessage("使用者未登入或登入錯誤!", null, locale) : ex.getMessage();
			status = HttpStatus.FORBIDDEN;
		} else if (ex instanceof PasswordInvalidException) {
			message = ex.getMessage().isEmpty()? messageSource.getMessage("密碼錯誤!", null, locale) : ex.getMessage();
			status = HttpStatus.BAD_REQUEST;
		} else if (ex instanceof UserNotFoundException) {
	        message = ex.getMessage().isEmpty() ? messageSource.getMessage("未找到該使用者!", null, locale) : ex.getMessage();
	        status = HttpStatus.NOT_FOUND;
	    } else {
	    	message = actualException.getMessage();
	        status = HttpStatus.INTERNAL_SERVER_ERROR;
	    }
		
		ApiResponse<String> response = ApiResponse.error(status.value(), message);
		return ResponseEntity.status(status).body(response);
	}
}
