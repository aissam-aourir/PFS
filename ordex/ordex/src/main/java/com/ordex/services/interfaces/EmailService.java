package com.ordex.services.interfaces;
public interface EmailService {
    void sendResetCode(String toEmail, String resetCode);
    void sendVerificationCode(String toEmail, String verificationCode);
    void sendVerificationInscription(String toEmail);
}
