package com.mra.mono.service;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.UUID;

@Service
public class OtpService {
    private HashMap<String, TokenData> tokenData = new HashMap<>();

    public String generateOtp(String key) {
        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(10);
        tokenData.put(key, new TokenData(token, expiryDate));
        return token;
    }

    public boolean validateOtp(String key, String otp) {
        if (tokenData.containsKey(key)) {
            TokenData storedTokenData = tokenData.get(key);
            String storedOtp = storedTokenData.getToken();
            LocalDateTime expiryDate = storedTokenData.getExpiryDate();
            if (LocalDateTime.now().isAfter(expiryDate)) {
                tokenData.remove(key);
                return false;
            }
            System.out.println("Stored OTP: " + storedOtp);
            System.out.println("Received OTP: " + otp);

            if (storedOtp.equals(otp)) {
                tokenData.remove(key); // Doğru ve süresi dolmamış token, doğrulandıktan sonra silinir
                return true;
            }
        }
        return false;
    }


    private static class TokenData {
        private String token;
        private LocalDateTime expiryDate;

        public TokenData(String token, LocalDateTime expiryDate) {
            this.token = token;
            this.expiryDate = expiryDate;
        }

        public String getToken() {
            return token;
        }

        public LocalDateTime getExpiryDate() {
            return expiryDate;
        }
    }
}
