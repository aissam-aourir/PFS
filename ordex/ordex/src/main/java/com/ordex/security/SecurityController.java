package com.ordex.security;
import com.ordex.helpers.LoginRequest;
import com.ordex.helpers.RegisterRequest;
import com.ordex.security.entities.Utilisateur;
import com.ordex.security.helpers.JwtService;
import com.ordex.security.service.AccountServiceImpl;
import com.ordex.services.implementations.EmailServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Random;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class SecurityController {

    private final AuthenticationManager authenticationManager;
    private final JwtEncoder jwtEncoder;
    private final AccountServiceImpl accountService;
    private final JwtService jwtService;
    @Autowired
    private EmailServiceImpl emailService;

    @PostMapping("/forgot-password")//postmaping nous permet de s eredidriger ed front vers le backend plus precisement vers cette methode, on fait metter ce mapping dans le URL
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        System.out.println("email saisi : " + email);
        if (email == null || email.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Email requis");
            return ResponseEntity.badRequest().body(response);
        }

        // Générer un code de réinitialisation (6 chiffres)
        String resetCode = String.format("%06d", new Random().nextInt(999999));
        System.out.println("Code de réinitialisation généré : " + resetCode);
        try {
            System.out.println("Envoi de l'email à : " + email);
            emailService.sendResetCode(email, resetCode);
            //cette requete de emailService.sendResetCode(email, resetCode); ne s'execute pas
            Map<String, String> response = new HashMap<>();
            response.put("message", "Code de réinitialisation envoyé");
            System.out.println("Email envoyé avec succès à : " + email);
            this.accountService.renitiliaserPassword(email, resetCode);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Échec de l'envoi de l'email : " + e.getMessage());
            System.out.println("Erreur lors de l'envoi de l'email : ");
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/verify-code")
    public ResponseEntity<Map<String, String>> verifyCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");
        String password = request.get("password");
        if (email == null || email.isEmpty() || code == null || code.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Email et code requis");
            return ResponseEntity.badRequest().body(response);
        }
        try {
            this.accountService.verifyResetCode(email, password, code);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Code vérifié avec succès");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/profile")
    public Authentication authentication (Authentication authentication){
        return authentication;}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(), loginRequest.getPassword()));

            Utilisateur user = accountService.loadUserByUsername(loginRequest.getUsername());

            // Check if the user is blocked
            if (user.isBlocked()) {
                return ResponseEntity.status(403).body(Map.of("error", "User is blocked"));
            }

            String jwt = jwtService.generateToken(authentication, user);

            return ResponseEntity.ok(Map.of("access-token", jwt));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid username or password"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            Utilisateur user = accountService.addNewUser(
                    request.getUsername(), request.getPassword(), request.getEmail());

            accountService.addRoleToUser(user.getUsername(), "CLIENT");

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getUsername(), request.getPassword()));

            String jwt = jwtService.generateToken(authentication, user);
            return ResponseEntity.ok(Map.of("access-token", jwt));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/block/{username}")
    public ResponseEntity<?> blockUser(@PathVariable String username) {
        try {
            Utilisateur blockedUser = accountService.blockUser(username);
            return ResponseEntity.ok(Map.of("message", "User blocked successfully", "user", blockedUser));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/unblock/{username}")
    public ResponseEntity<?> unblockUser(@PathVariable String username) {
        try {
            Utilisateur unblockedUser = accountService.unblockUser(username);
            return ResponseEntity.ok(Map.of("message", "User unblocked successfully"));
        } catch (RuntimeException e) {
//            System.out.println("Message is "+e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }






}
