package com.ordex.services.interfaces;
import com.ordex.helpers.OrderResponseDTO;
//impoerte orderre
public interface EmailService {
    void sendLoginNotification(String toEmail, String username);
    void sendResetCode(String toEmail, String resetCode);
    void sendVerificationCode(String toEmail, String verificationCode);
    void sendVerificationInscription(String toEmail);
    //informer le user que la renitialisation de mot de passe est passe aec succe
    void sendPasswordResetSuccess(String toEmail);
    //informer un user qu'il est bloque
    void sendBlockNotification(String toEmail,String username);
    //informer un user qu'il est debloque
    void sendUnblockNotification(String toEmail,String username);
    //envoyer un email pour informer le user qu'il a un a fait uen commande ,
    void sendOrderConfirmation(String toEmail, OrderResponseDTO order);
    //envoyer une infornation vers le client en cas de accepation de la commande
    void sendOrderAccepted(String toEmail, OrderResponseDTO order);
    //envoyer une information vers le client en cas de refus de la commande
    void sendOrderRejected(String toEmail, OrderResponseDTO order);
}
