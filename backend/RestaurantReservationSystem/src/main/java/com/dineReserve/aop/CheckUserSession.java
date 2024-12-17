package com.dineReserve.aop;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD) // 此註解僅能用於方法
@Retention(RetentionPolicy.RUNTIME) // 此註解在系統運行時持續有效
public @interface CheckUserSession { // @interface 自訂義註解關鍵字

}
