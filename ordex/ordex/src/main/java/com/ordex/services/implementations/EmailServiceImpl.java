package com.ordex.services.implementations;

import com.ordex.services.interfaces.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import com.ordex.helpers.OrderResponseDTO;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendLoginNotification(String toEmail, String username) {
        System.out.println("ici dans sendLoginNotification");
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(toEmail);
            helper.setSubject("🔑 Connexion à votre compte - Ordex");
            helper.setFrom("aissamaourir2@gmail.com");

            String htmlContent = "<div style='font-family:Arial,sans-serif;background:#f4f4f4;padding:20px;'>"
                    + "<div style='max-width:600px;margin:auto;background:white;padding:20px;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>"
                    + "<div style='text-align:center;'>"
                    + "<img src='cid:logoImage' alt='Ordex Logo' style='width:100px;margin-bottom:20px;'/>"
                    + "<h2 style='color:#333;'>🔑 Nouvelle connexion détectée</h2>"
                    + "</div>"
                    + "<p style='font-size:16px;color:#444;'>Bonjour " + username + ",</p>"
                    + "<p style='font-size:16px;color:#444;'>Une connexion à votre compte Ordex a été détectée.</p>"
                    + "<p style='font-size:16px;color:#444;'>Si ce n'était pas vous, veuillez sécuriser votre compte immédiatement.</p>"
                    + "<div style='text-align:center;margin:20px 0;'>"
                    + "<a href='https://www.ordex.com/login' style='background:#007bff;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;font-size:16px;'>Vérifier mon compte</a>"
                    + "</div>"
                    + "<p style='font-size:14px;color:#888;'>Si vous avez des questions, contactez notre support.</p>"
                    + "<br><p style='font-size:14px;color:#aaa;text-align:center;'>© 2025 Ordex • Tous droits réservés</p>"
                    + "</div></div>";

            helper.setText(htmlContent, true);

            // Joindre l'image logo2.png
            ClassPathResource image = new ClassPathResource("logo2.png");
            helper.addInline("logoImage", image);

            mailSender.send(message);
            System.out.println("E-mail de notification de connexion envoyé à : " + toEmail);

        } catch (MessagingException e) {
            e.printStackTrace();
            System.out.println("Erreur lors de l'envoi de l'e-mail de notification de connexion : " + e.getMessage());
        }
    }

    @Override
    public void sendResetCode(String toEmail, String resetCode) {
        System.out.println("ici dans sendResetCode");

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("🔐 Code de réinitialisation - Ordex");
            helper.setFrom("aissamaourir2@gmail.com");

            String htmlContent = "<div style='font-family:Arial,sans-serif;background:#f4f4f4;padding:20px;'>"
                    + "<div style='max-width:600px;margin:auto;background:white;padding:20px;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>"
                    + "<div style='text-align:center;'>"
                    + "<img src='cid:logoImage' alt='Ordex Logo' style='width:100px;margin-bottom:20px;'/>"
                    + "<h2 style='color:#333;'>🔐 Ordex - Réinitialisation</h2>"
                    + "</div>"
                    + "<p style='font-size:16px;color:#444;'>Bonjour,</p>"
                    + "<p style='font-size:16px;color:#444;'>Voici votre code de réinitialisation :</p>"
                    + "<div style='font-size:24px;font-weight:bold;color:#007bff;text-align:center;margin:20px 0;'>" + resetCode + "</div>"
                    + "<p style='font-size:14px;color:#888;'>Ce code est <strong>valide pendant 10 minutes</strong>. Ne le partagez avec personne.</p>"
                    + "<br><p style='font-size:14px;color:#aaa;text-align:center;'>© 2025 Ordex • Tous droits réservés</p>"
                    + "</div></div>";

            helper.setText(htmlContent, true);

            // Joindre l'image logo2.png depuis le même dossier (resources)
            ClassPathResource image = new ClassPathResource("logo2.png");
            helper.addInline("logoImage", image);

            mailSender.send(message);
            System.out.println("ici dans après mailSender.send");

        } catch (MessagingException e) {
            e.printStackTrace();
            System.out.println("Erreur lors de l'envoi du mail : " + e.getMessage());
        }
    }

    @Override
    public void sendVerificationCode(String toEmail, String verificationCode) {
        System.out.println("ici dans sendVerificationCode");

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("✅ Code de vérification - Ordex");
            helper.setFrom("aissamaourir2@gmail.com");

            String htmlContent = "<div style='font-family:Arial,sans-serif;background:#f4f4f4;padding:20px;'>"
                    + "<div style='max-width:600px;margin:auto;background:white;padding:20px;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>"
                    + "<div style='text-align:center;'>"
                    + "<img src='cid:logoImage' alt='Ordex Logo' style='width:100px;margin-bottom:20px;'/>"
                    + "<h2 style='color:#333;'>✅ Ordex - Vérification d'inscription</h2>"
                    + "</div>"
                    + "<p style='font-size:16px;color:#444;'>Bonjour,</p>"
                    + "<p style='font-size:16px;color:#444;'>Voici votre code de vérification d'inscription :</p>"
                    + "<div style='font-size:24px;font-weight:bold;color:#007bff;text-align:center;margin:20px 0;'>" + verificationCode + "</div>"
                    + "<p style='font-size:14px;color:#888;'>Ce code est <strong>valide pendant 10 minutes</strong>. Ne le partagez avec personne.</p>"
                    + "<br><p style='font-size:14px;color:#aaa;text-align:center;'>© 2025 Ordex • Tous droits réservés</p>"
                    + "</div></div>";

            helper.setText(htmlContent, true);

            // Joindre l'image logo2.png depuis le même dossier (resources)
            ClassPathResource image = new ClassPathResource("logo2.png");
            helper.addInline("logoImage", image);

            mailSender.send(message);
            System.out.println("ici dans après mailSender.send");

        } catch (MessagingException e) {
            e.printStackTrace();
            System.out.println("Erreur lors de l'envoi du mail : " + e.getMessage());
        }
    }

    @Override
    public void sendVerificationInscription(String toEmail) {
        System.out.println("ici dans sendVerificationInscription");

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("🎉 Inscription activée - Ordex");
            helper.setFrom("aissamaourir2@gmail.com");

            String htmlContent = "<div style='font-family:Arial,sans-serif;background:#f4f4f4;padding:20px;'>"
                    + "<div style='max-width:600px;margin:auto;background:white;padding:20px;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>"
                    + "<div style='text-align:center;'>"
                    + "<img src='cid:logoImage' alt='Ordex Logo' style='width:100px;margin-bottom:20px;'/>"
                    + "<h2 style='color:#333;'>🎉 Bienvenue chez Ordex !</h2>"
                    + "</div>"
                    + "<p style='font-size:16px;color:#444;'>Bonjour,</p>"
                    + "<p style='font-size:16px;color:#444;'>Félicitations ! Votre inscription a été activée avec succès.</p>"
                    + "<p style='font-size:16px;color:#444;'>Vous pouvez maintenant profiter de toutes les fonctionnalités d'Ordex.</p>"
                    + "<div style='text-align:center;margin:20px 0;'>"
                    + "<a href='https://www.ordex.com/login' style='background:#007bff;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;font-size:16px;'>Se connecter</a>"
                    + "</div>"
                    + "<p style='font-size:14px;color:#888;'>Si vous n'avez pas initié cette inscription, veuillez nous contacter immédiatement.</p>"
                    + "<br><p style='font-size:14px;color:#aaa;text-align:center;'>© 2025 Ordex • Tous droits réservés</p>"
                    + "</div></div>";

            helper.setText(htmlContent, true);

            // Joindre l'image logo2.png depuis le même dossier (resources)
            ClassPathResource image = new ClassPathResource("logo2.png");
            helper.addInline("logoImage", image);

            mailSender.send(message);
            System.out.println("ici dans après mailSender.send");

        } catch (MessagingException e) {
            e.printStackTrace();
            System.out.println("Erreur lors de l'envoi du mail : " + e.getMessage());
        }
    }

    @Override
    public void sendPasswordResetSuccess(String toEmail) {
        System.out.println("ici dans sendPasswordResetSuccess");

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("🔐 Mot de passe réinitialisé avec succès - Ordex");
            helper.setFrom("aissamaourir2@gmail.com");

            String htmlContent = "<div style='font-family:Arial,sans-serif;background:#f4f4f4;padding:20px;'>"
                    + "<div style='max-width:600px;margin:auto;background:white;padding:20px;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>"
                    + "<div style='text-align:center;'>"
                    + "<img src='cid:logoImage' alt='Ordex Logo' style='width:100px;margin-bottom:20px;'/>"
                    + "<h2 style='color:#333;'>🔐 Réinitialisation réussie</h2>"
                    + "</div>"
                    + "<p style='font-size:16px;color:#444;'>Bonjour,</p>"
                    + "<p style='font-size:16px;color:#444;'>Votre mot de passe a été <strong>réinitialisé avec succès</strong>.</p>"
                    + "<p style='font-size:16px;color:#444;'>Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>"
                    + "<div style='text-align:center;margin:20px 0;'>"
                    + "<a href='https://www.ordex.com/login' style='background:#007bff;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;font-size:16px;'>Se connecter</a>"
                    + "</div>"
                    + "<p style='font-size:14px;color:#888;'>Si vous n'êtes pas à l'origine de cette réinitialisation, veuillez nous contacter immédiatement.</p>"
                    + "<br><p style='font-size:14px;color:#aaa;text-align:center;'>© 2025 Ordex • Tous droits réservés</p>"
                    + "</div></div>";

            helper.setText(htmlContent, true);

            // Joindre l’image
            ClassPathResource image = new ClassPathResource("logo2.png");
            helper.addInline("logoImage", image);

            mailSender.send(message);
            System.out.println("Email de confirmation de réinitialisation envoyé.");

        } catch (MessagingException e) {
            e.printStackTrace();
            System.out.println("Erreur lors de l'envoi de l'e-mail de succès de réinitialisation : " + e.getMessage());
        }
    }

    @Override
    public void sendBlockNotification(String toEmail, String username) {
        System.out.println("ici dans sendBlockNotification");
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(toEmail);
            helper.setSubject("🚫 Compte bloqué - Ordex");
            helper.setFrom("aissamaourir2@gmail.com");
            String htmlContent = "<div style='font-family:Arial,sans-serif;background:#f4f4f4;padding:20px;'>"
                    + "<div style='max-width:600px;margin:auto;background:white;padding:20px;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>"
                    + "<div style='text-align:center;'>"
                    + "<img src='cid:logoImage' alt='Ordex Logo' style='width:100px;margin-bottom:20px;'/>"
                    + "<h2 style='color:#333;'>🚫 Compte bloqué</h2>"
                    + "</div>"
                    + "<p style='font-size:16px;color:#444;'>Bonjour " + username + ",</p>"
                    + "<p style='font-size:16px;color:#444;'>Votre compte a été bloqué en raison de plusieurs tentatives de connexion échouées.</p>"
                    + "<p style='font-size:16px;color:#444;'>Veuillez contacter le support pour plus d'informations.</p>"
                    + "<br><p style='font-size:14px;color:#aaa;text-align:center;'>© 2025 Ordex • Tous droits réservés</p>"
                    + "</div></div>";
            helper.setText(htmlContent, true);
            ClassPathResource image = new ClassPathResource("logo2.png");
            helper.addInline("logoImage", image);
            mailSender.send(message);
            System.out.println("ici après mailSender.send dans le cas de blocage");
        } catch (MessagingException e) {
            e.printStackTrace();
            System.out.println("Erreur lors de l'envoi du mail : " + e.getMessage());
        }
    }

    @Override
    public  void sendUnblockNotification(String toEmail,String username) {
        System.out.println("ici dans sendUnblockNotification");
        try{
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper=new MimeMessageHelper(message,true);
            helper.setTo(toEmail);
            helper.setSubject("✅ Compte débloqué - Ordex");
            helper.setFrom("aissamaourir2@gmail.com");
            String htmlContent="<div style='font-family:Arial,sans-serif;background:#f4f4f4;padding:20px;'>"
                    + "<div style='max-width:600px;margin:auto;background:white;padding:20px;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>"
                    + "<div style='text-align:center;'>"
                    + "<img src='cid:logoImage' alt='Ordex Logo' style='width:100px;margin-bottom:20px;'/>"
                    + "<h2 style='color:#333;'>✅ Compte débloqué</h2>"
                    + "</div>"
                    + "<p style='font-size:16px;color:#444;'>Bonjour "+username+",</p>"
                    + "<p style='font-size:16px;color:#444;'>Votre compte a été débloqué avec succès.</p>"
                    + "<p style='font-size:16px;color:#444;'>Vous pouvez maintenant vous connecter à votre compte.</p>"
                    + "<br><p style='font-size:14px;color:#aaa;text-align:center;'>© 2025 Ordex • Tous droits réservés</p>"
                    + "</div></div>";
            helper.setText(htmlContent,true);
            ClassPathResource image=new ClassPathResource("logo2.png");
            helper.addInline("logoImage",image);
            mailSender.send(message);
            System.out.println("ici apres avoir emis le mail dans le cas de deblocage");
        }catch (MessagingException e) {
            e.printStackTrace();
            System.out.println("Erreur lors de l'envoi du mail : " + e.getMessage());
        }
    }

    //ici pour faire e onvoyer un email d'une commande, just pour informer le passage
    // de la commande seulement
    @Override
    public void sendOrderConfirmation(String toEmail, OrderResponseDTO order) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(toEmail);
            helper.setSubject("✅ Confirmation de votre commande - Ordex");
            helper.setFrom("aissamaourir2@gmail.com");
            // Construire le contenu HTML de l'e-mail
            StringBuilder productsHtml = new StringBuilder();
            for (OrderResponseDTO.OrderProductDTO product : order.getOrderProducts()) {
                productsHtml.append(String.format(
                        "<tr style='border-bottom:1px solid #eee;'>"
                                + "<td style='padding:10px;'>%s</td>"
                                + "<td style='padding:10px;text-align:center;'>%d</td>"
                                + "<td style='padding:10px;text-align:right;'>%.2f €</td>"
                                + "</tr>",
                        product.getProduct().getName(),
                        product.getQuantity(),
                        product.getPriceAtPurchases()
                ));
            }

            String htmlContent = "<div style='font-family:Arial,sans-serif;background:#f4f4f4;padding:20px;'>"
                    + "<div style='max-width:600px;margin:auto;background:white;padding:20px;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>"
                    + "<div style='text-align:center;'>"
                    + "<img src='cid:logoImage' alt='Ordex Logo' style='width:100px;margin-bottom:20px;'/>"
                    + "<h2 style='color:#333;'>✅ Confirmation de commande</h2>"
                    + "</div>"
                    + "<p style='font-size:16px;color:#444;'>Bonjour " + order.getClient().getUsername() + ",</p>"
                    + "<p style='font-size:16px;color:#444;'>Merci pour votre commande ! Voici les détails :</p>"
                    + "<div style='margin:20px 0;'>"
                    + "<table style='width:100%;border-collapse:collapse;'>"
                    + "<tr style='background:#f8f8f8;'>"
                    + "<th style='padding:10px;text-align:left;'>Commande #" + order.getId() + "</th>"
                    + "<th style='padding:10px;text-align:right;'>Date: " + order.getCreatedAt() + "</th>"
                    + "</tr>"
                    + "<tr><td style='padding:10px;'>Statut :</td><td style='padding:10px;text-align:right;'>" + order.getStatus() + "</td></tr>"
                    + "<tr><td style='padding:10px;'>Total :</td><td style='padding:10px;text-align:right;'>" + String.format("%.2f €", order.getTotal()) + "</td></tr>"
                    + "<tr><td style='padding:10px;'>Méthode de paiement :</td><td style='padding:10px;text-align:right;'>" + order.getPaymentMethod() + "</td></tr>"
                    + "</table>"
                    + "<h3 style='color:#333;margin-top:20px;'>Produits commandés</h3>"
                    + "<table style='width:100%;border-collapse:collapse;'>"
                    + "<tr style='background:#f8f8f8;'>"
                    + "<th style='padding:10px;text-align:left;'>Produit</th>"
                    + "<th style='padding:10px;text-align:center;'>Quantité</th>"
                    + "<th style='padding:10px;text-align:right;'>Prix</th>"
                    + "</tr>"
                    + productsHtml
                    + "</table>"
                    + "</div>"
                    + "<p style='font-size:16px;color:#444;'>Vous pouvez suivre votre commande dans votre compte Ordex.</p>"
                    + "<p style='font-size:16px;color:#444;text-align:center;'><a href='https://ordex.com' style='color:#007bff;text-decoration:none;'>Accéder à mon compte</a></p>"
                    + "<br><p style='font-size:14px;color:#aaa;text-align:center;'>© 2025 Ordex • Tous droits réservés</p>"
                    + "</div></div>";

            helper.setText(htmlContent, true);

            // Ajouter le logo si nécessaire (assurez-vous que l'image est configurée correctement)
            // Exemple : helper.addInline("logoImage", new ClassPathResource("images/logo.png"));

            mailSender.send(message);
            System.out.println("E-mail de confirmation de commande envoyé à : " + toEmail);

        } catch (MessagingException e) {
            e.printStackTrace();
            System.out.println("Erreur lors de l'envoi de l'e-mail de confirmation : " + e.getMessage());
        }
    }

    // Cette méthode envoie un e-mail au client pour l'informer que sa commande a été acceptée.
    @Override
    public void sendOrderAccepted(String toEmail, OrderResponseDTO order) {
        System.out.println("ici dans sendOrderAccepted");
        try {
            System.out.println("Envoi de l'e-mail d'acceptation de commande à : " + toEmail);
            // Validation des paramètres
            if (toEmail == null || toEmail.isEmpty()) {
                System.out.println("L'adresse eeeeee-mail ne peut pas être vide ou nulle");
                throw new IllegalArgumentException("L'adresse e-mail ne peut pas être vide ou nulle");
            }
            if (order == null || order.getClient() == null) {
                if (order == null) System.out.println("order nulllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll");
                if (order != null && order.getClient() == null) System.out.println("Le client de la commande ne peut pas être nul");
                System.out.println("Les détails de la commande ne peuvent pas être nulsppppppppppppp");
                throw new IllegalArgumentException("Les détails de la commande ne peuvent pas être nuls");
            }
            System.out.println("Préparation de l'e-mail pour la commande #" + order.getId() + " pour le client " + order.getClient().getUsername());
            MimeMessage message = mailSender.createMimeMessage();
            System.out.println("Création du message MIME");
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(toEmail);
            System.out.println("Définition de l'adresse e-mail du destinataire : " + toEmail);
            helper.setSubject("👍 Commande acceptée - Ordex");
            helper.setFrom("aissamaourir2@gmail.com");
            System.out.println("Définition de l'objet de l'e-mail : Commande acceptée - Ordex");

            // Construire le contenu HTML de l'e-mail
            System.out.println("Construction du contenu HTML de l'e-mail");
            String htmlContent = "<div style='font-family:Arial,sans-serif;background:#f4f4f4;padding:30px;'>"
                    + "<div style='max-width:600px;margin:auto;background:white;padding:25px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);'>"
                    + "<div style='text-align:center;'>"
                    + "<img src='cid:logoImage' alt='Ordex Logo' style='width:120px;margin-bottom:20px;'/>"
                    + "<h2 style='color:#333;font-size:24px;margin:0;'>🎉 Commande acceptée !</h2>"
                    + "</div>"
                    + "<p style='font-size:16px;color:#444;margin:20px 0;'>Bonjour " + order.getClient().getUsername() + ",</p>"
                    + "<p style='font-size:16px;color:#444;line-height:1.6;'>Nous sommes ravis de vous informer que votre <strong>commande n°" + order.getId() + "</strong> passée le <strong>" + order.getCreatedAt() + "</strong> a été acceptée avec succès. Merci de faire vos achats avec Ordex !</p>"
                    + "<div style='margin:25px 0;background:#f9f9f9;padding:20px;border-radius:8px;'>"
                    + "<h3 style='color:#333;font-size:18px;margin:0 0 15px 0;'>Détails de la commande</h3>"
                    + "<table style='width:100%;border-collapse:collapse;font-size:15px;color:#444;'>"
                    + "<tr style='background:#f1f1f1;'>"
                    + "<th style='padding:12px;text-align:left;'>Commande #" + order.getId() + "</th>"
                    + "<th style='padding:12px;text-align:right;'>Date: " + order.getCreatedAt() + "</th>"
                    + "</tr>"
                    + "<tr><td style='padding:12px;border-bottom:1px solid #eee;'>Statut :</td><td style='padding:12px;text-align:right;border-bottom:1px solid #eee;'>" + order.getStatus() + "</td></tr>"
                    + "<tr><td style='padding:12px;border-bottom:1px solid #eee;'>Total :</td><td style='padding:12px;text-align:right;border-bottom:1px solid #eee;'>" + String.format("%.2f €", order.getTotal()) + "</td></tr>"
                    + "<tr><td style='padding:12px;'>Méthode de paiement :</td><td style='padding:12px;text-align:right;'>" + order.getPaymentMethod() + "</td></tr>"
                    + "</table>"
                    + "</div>"
                    + "<p style='font-size:16px;color:#444;line-height:1.6;'>Vous pouvez suivre l'état de votre commande à tout moment depuis votre compte Ordex.</p>"
                    + "<div style='text-align:center;margin:30px 0;'>"
                    + "<a href='https://www.ordex.com' style='display:inline-block;background:#007bff;color:white;padding:12px 30px;text-decoration:none;border-radius:6px;font-size:16px;font-weight:bold;'>Suivre ma commande</a>"
                    + "</div>"
                    + "<p style='font-size:14px;color:#666;line-height:1.5;'>Besoin d'aide ? Notre équipe est là pour vous. Contactez-nous via <a href='https://www.ordex.com/support' style='color:#007bff;text-decoration:none;'>notre support</a> ou par e-mail à support@ordex.com.</p>"
                    + "<hr style='border:0;border-top:1px solid #eee;margin:20px 0;'>"
                    + "<div style='text-align:center;color:#aaa;font-size:12px;'>"
                    + "<p>© 2025 Ordex • Tous droits réservés</p>"
                    + "<p><a href='https://www.ordex.com' style='color:#aaa;text-decoration:none;margin:0 10px;'>Accueil</a> | "
                    + "<a href='https://www.ordex.com/about' style='color:#aaa;text-decoration:none;margin:0 10px;'>À propos</a> | "
                    + "<a href='https://www.ordex.com/support' style='color:#aaa;text-decoration:none;margin:0 10px;'>Support</a></p>"
                    + "</div>"
                    + "</div></div>";
            System.out.println("Définition du contenu HTML de l'e-mail");
            helper.setText(htmlContent, true);
            System.out.println("Définition du contenu HTML de l'e-mail8888888");

            // Joindre l'image logo2.png depuis le dossier resources
            ClassPathResource image = new ClassPathResource("logo2.png");
            System.out.println("Ajout de l'image logo2.png en tant qu'inline");
            helper.addInline("logoImage", image);
            System.out.println("Ajout de l'image logo2.png en tant qu'inline444444444444444");

            mailSender.send(message);
            System.out.println("E-mail de confirmation d'acceptation de commande envoyé à : " + toEmail);

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Erreur lors de l'envoi de l'e-mail d'acceptation de commande : " + e.getMessage());
        }
    }

    //Cette méthode envoie un e-mail au client pour l'informer que sa commande a ete rejette.
    @Override
    public void sendOrderRejected(String toEmail, OrderResponseDTO order) {
        System.out.println("ici dans sendOrderRejected");
        try {
            System.out.println("Envoi de l'e-mail de refus de commande à : " + toEmail);
            // Validation des paramètres
            if (toEmail == null || toEmail.isEmpty()) {
                System.out.println("L'adresse eeeeee-mail ne peut pas être vide ou nulle");
                throw new IllegalArgumentException("L'adresse e-mail ne peut pas être vide ou nulle");
            }
            if (order == null || order.getClient() == null) {
                if (order == null) System.out.println("order nulllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll");
                if (order != null && order.getClient() == null) System.out.println("Le client de la commande ne peut pas être nul");
                System.out.println("Les détails de la commande ne peuvent pas être nulsppppppppppppp");
                throw new IllegalArgumentException("Les détails de la commande ne peuvent pas être nuls");
            }
            System.out.println("Préparation de l'e-mail pour la commande #" + order.getId() + " pour le client " + order.getClient().getUsername());
            MimeMessage message = mailSender.createMimeMessage();
            System.out.println("Création du message MIME");
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(toEmail);
            System.out.println("Définition de l'adresse e-mail du destinataire : " + toEmail);
            helper.setSubject("❌ Commande refusée - Ordex");
            helper.setFrom("aissamaourir2@gmail.com");
            System.out.println("Définition de l'objet de l'e-mail : Commande refusée - Ordex");

            // Construire le contenu HTML de l'e-mail
            System.out.println("Construction du contenu HTML de l'e-mail");
            String htmlContent = "<div style='font-family:Arial,sans-serif;background:#f4f4f4;padding:30px;'>"
                    + "<div style='max-width:600px;margin:auto;background:white;padding:25px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);'>"
                    + "<div style='text-align:center;'>"
                    + "<img src='cid:logoImage' alt='Ordex Logo' style='width:120px;margin-bottom:20px;'/>"
                    + "<h2 style='color:#333;font-size:24px;margin:0;'>❌ Commande refusée</h2>"
                    + "</div>"
                    + "<p style='font-size:16px;color:#444;margin:20px 0;'>Bonjour " + order.getClient().getUsername() + ",</p>"
                    + "<p style='font-size:16px;color:#444;line-height:1.6;'>Nous sommes désolés de vous informer que votre <strong>commande n°" + order.getId() + "</strong> passée le <strong>" + order.getCreatedAt() + "</strong> n'a pas pu être acceptée en raison d'un problème de validation ou d'indisponibilité.</p>"
                    + "<div style='margin:25px 0;background:#f9f9f9;padding:20px;border-radius:8px;'>"
                    + "<h3 style='color:#333;font-size:18px;margin:0 0 15px 0;'>Détails de la commande</h3>"
                    + "<table style='width:100%;border-collapse:collapse;font-size:15px;color:#444;'>"
                    + "<tr style='background:#f1f1f1;'>"
                    + "<th style='padding:12px;text-align:left;'>Commande #" + order.getId() + "</th>"
                    + "<th style='padding:12px;text-align:right;'>Date: " + order.getCreatedAt() + "</th>"
                    + "</tr>"
                    + "<tr><td style='padding:12px;border-bottom:1px solid #eee;'>Statut :</td><td style='padding:12px;text-align:right;border-bottom:1px solid #eee;'>" + order.getStatus() + "</td></tr>"
                    + "<tr><td style='padding:12px;border-bottom:1px solid #eee;'>Total :</td><td style='padding:12px;text-align:right;border-bottom:1px solid #eee;'>" + String.format("%.2f €", order.getTotal()) + "</td></tr>"
                    + "<tr><td style='padding:12px;'>Méthode de paiement :</td><td style='padding:12px;text-align:right;'>" + order.getPaymentMethod() + "</td></tr>"
                    + "</table>"
                    + "</div>"
                    + "<p style='font-size:16px;color:#444;line-height:1.6;'>Pour plus de détails ou pour résoudre ce problème, veuillez contacter notre équipe de support. Nous sommes là pour vous aider !</p>"
                    + "<div style='text-align:center;margin:30px 0;'>"
                    + "<a href='https://www.ordex.com/support' style='display:inline-block;background:#007bff;color:white;padding:12px 30px;text-decoration:none;border-radius:6px;font-size:16px;font-weight:bold;'>Contacter le support</a>"
                    + "</div>"
                    + "<p style='font-size:14px;color:#666;line-height:1.5;'>Nous nous excusons pour ce désagrément. Merci de votre compréhension.</p>"
                    + "<hr style='border:0;border-top:1px solid #eee;margin:20px 0;'>"
                    + "<div style='text-align:center;color:#aaa;font-size:12px;'>"
                    + "<p>© 2025 Ordex • Tous droits réservés</p>"
                    + "<p><a href='https://www.ordex.com' style='color:#aaa;text-decoration:none;margin:0 10px;'>Accueil</a> | "
                    + "<a href='https://www.ordex.com/about' style='color:#aaa;text-decoration:none;margin:0 10px;'>À propos</a> | "
                    + "<a href='https://www.ordex.com/support' style='color:#aaa;text-decoration:none;margin:0 10px;'>Support</a></p>"
                    + "</div>"
                    + "</div></div>";
            System.out.println("Définition du contenu HTML de l'e-mail");
            helper.setText(htmlContent, true);
            System.out.println("Définition du contenu HTML de l'e-mail8888888");

            // Joindre l'image logo2.png depuis le dossier resources
            ClassPathResource image = new ClassPathResource("logo2.png");
            System.out.println("Ajout de l'image logo2.png en tant qu'inline");
            helper.addInline("logoImage", image);
            System.out.println("Ajout de l'image logo2.png en tant qu'inline444444444444444");

            mailSender.send(message);
            System.out.println("E-mail de refus de commande envoyé à : " + toEmail);

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Erreur lors de l'envoi de l'e-mail de refus de commande : " + e.getMessage());
        }
    }

}
