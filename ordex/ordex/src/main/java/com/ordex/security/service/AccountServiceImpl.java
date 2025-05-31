package com.ordex.security.service;

import com.ordex.security.entities.AppRole;
import com.ordex.security.entities.Utilisateur;
import com.ordex.security.repository.AppRoleRepository;
import com.ordex.security.repository.UtilisateurRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Transactional
@AllArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final UtilisateurRepository utilisateurRepository;
    private final AppRoleRepository appRoleRepository;
    private PasswordEncoder passwordEncoder;
    private final Map<String, TempUser> tempUsers = new ConcurrentHashMap<>();

    private static class TempUser {
        String username;
        String email;
        String password;
        String verificationCode;

        TempUser(String username, String email, String password, String verificationCode) {
            this.username = username;
            this.email = email;
            this.password = password;
            this.verificationCode = verificationCode;
        }
    }

    @Override
    public Utilisateur addNewUser(String username, String password, String email) {
        Utilisateur user = utilisateurRepository.findByUsername(username);
        if (user != null) throw new RuntimeException("Cet utilisateur existe déjà");
        user = Utilisateur.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .email(email)
                .roles(new ArrayList<>())
                .createdAt(LocalDateTime.now(ZoneId.systemDefault()))
                .build();
        return utilisateurRepository.save(user);
    }

    @Override
    public boolean verifyExistenceOfUsername(String username) {
        Utilisateur user = utilisateurRepository.findByUsername(username);
        return user != null;
    }

    @Override
    public AppRole addNewRole(String role) {
        AppRole appRole = appRoleRepository.findById(role).orElse(null);
        if (appRole != null) throw new RuntimeException("Ce rôle existe déjà");
        appRole = AppRole.builder()
                .role(role)
                .build();
        return appRoleRepository.save(appRole);
    }

    @Override
    public void addRoleToUser(String username, String role) {
        Utilisateur utilisateur = utilisateurRepository.findByUsername(username);
        AppRole appRole = appRoleRepository.findById(role).get();
        utilisateur.getRoles().add(appRole);
    }

    @Override
    public Utilisateur loadUserByUsername(String username) {
        Utilisateur utilisateur = utilisateurRepository.findByUsername(username);
        if (utilisateur == null) {
            throw new UsernameNotFoundException("Utilisateur non trouvé");
        }
        return utilisateur;
    }

    @Override
    public Utilisateur findById(Long id) {
        return utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + id));
    }

    @Override
    public void updatePassword(String email, String newPassword) {
        Utilisateur user = utilisateurRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("Utilisateur non trouvé");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        utilisateurRepository.save(user);
    }

    @Override
    public void renitiliaserPassword(String email, String tempPassword) {
        Utilisateur user = utilisateurRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("Utilisateur non trouvé");
        }
        user.setTem_password(tempPassword);
        utilisateurRepository.save(user);
    }

    @Override
    public void verifyResetCode(String email, String password, String code) {
        Utilisateur user = utilisateurRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("Utilisateur non trouvé");
        }
        if (user.getTem_password() == null || !user.getTem_password().equals(code)) {
            throw new RuntimeException("Code de réinitialisation invalide");
        }
        user.setPassword(passwordEncoder.encode(password));
        utilisateurRepository.save(user);
    }

    @Override
    public List<Utilisateur> getAllSuppliers() {
        return getUsersByRole("SUPPLIER");
    }

    @Override
    public List<Utilisateur> getAllClients() {
        return getUsersByRole("CLIENT");
    }

    private List<Utilisateur> getUsersByRole(String role) {
        List<Utilisateur> users = utilisateurRepository.findAll()
                .stream()
                .filter(u -> u.getRoles().stream()
                        .anyMatch(r -> role.equals(r.getRole())))
                .toList();
        List<Utilisateur> reversed = new ArrayList<>(users);
        Collections.reverse(reversed);
        return reversed;
    }

    public Utilisateur blockUser(String username) {
        System.out.println("22222222222222222222222222222");
        Utilisateur user = utilisateurRepository.findByUsername(username);
        System.out.println("3333333333333333333333333333333");
        if (user == null) {
            throw new RuntimeException("Utilisateur non trouvé");
        }
        user.setBlocked(true);
        System.out.println("444444444444444444444444444444444444");
        return utilisateurRepository.save(user);
    }

    public Utilisateur unblockUser(String username) {
        Utilisateur user = utilisateurRepository.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("Utilisateur non trouvé");
        }
        user.setBlocked(false);
        return utilisateurRepository.save(user);
    }

    public void saveTempUser(String username, String email, String password, String verificationCode) {
        tempUsers.put(email, new TempUser(username, email, password, verificationCode));
    }

    public Utilisateur verifyRegisterCode(String email, String code, String username, String password) {
        TempUser tempUser = tempUsers.get(email);
        if (tempUser == null) {
            throw new RuntimeException("Aucune inscription en attente pour cet email");
        }
        if (!tempUser.verificationCode.equals(code)) {
            throw new RuntimeException("Code de vérification invalide");
        }
        if (!tempUser.username.equals(username) || !tempUser.email.equals(email) || !tempUser.password.equals(password)) {
            throw new RuntimeException("Les données fournies ne correspondent pas");
        }
        Utilisateur user = addNewUser(username, password, email);
        tempUsers.remove(email);
        return user;
    }
}