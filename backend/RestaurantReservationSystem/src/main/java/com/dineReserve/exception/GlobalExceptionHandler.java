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
		HttpStatus status = null;
		
		if (ex instanceof UnauthorizedException) {
			message = ex.getMessage().isEmpty()? messageSource.getMessage("exception.unauthorized", null, locale) : ex.getMessage();
			status = HttpStatus.FORBIDDEN;
		}
		
		ApiResponse<String> response = ApiResponse.error(status.value(), message);
		return ResponseEntity.status(status).body(response);
	}
}
