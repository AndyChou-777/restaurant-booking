package com.dineReserve.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

import com.dineReserve.exception.PasswordInvalidException;

/**
 * 用於處理密碼驗證的工具類。
 */

public class PasswordUtil {

    public static boolean verifyPassword(String rawPassword, String storedPasswordHash, String salt) {
        String hashedPassword = hashPassword(rawPassword, salt);
        return storedPasswordHash.equals(hashedPassword);
    }

    // 將原始密碼與 salt 組合，並進行哈希處理
    private static String hashPassword(String password, String salt) {
        try {
            MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
            messageDigest.update((salt + password).getBytes());
            byte[] hashedBytes = messageDigest.digest();
            return Base64.getEncoder().encodeToString(hashedBytes);
        } catch (NoSuchAlgorithmException e) {
            throw new PasswordInvalidException();
        }
    }
}

