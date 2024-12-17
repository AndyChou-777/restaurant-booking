package com.dineReserve.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

public class Hash {
	
	// 產生鹽
	public static String getSalt() {
		
		SecureRandom secureRandom = new SecureRandom();
		byte[] salt = new byte[16];
		secureRandom.nextBytes(salt);
		return Base64.getEncoder().encodeToString(salt);
	}
	
	// 產生含鹽雜湊
	public static String getHash(String password, String salt) {
		
		try {
			MessageDigest md = MessageDigest.getInstance("SHA-256");
			md.update(salt.getBytes());
			byte[] bytes = md.digest(password.getBytes());
			return Base64.getEncoder().encodeToString(bytes);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

}
