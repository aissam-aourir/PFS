package com.ordex.security.service;

import com.ordex.security.entities.AppRole;
import com.ordex.security.entities.Utilisateur;

import java.util.List;

public interface AccountService {
    //mise a jour ici dans addnewuser mais je l'ai supprime , il faut que je la rajoute apres
    Utilisateur addNewUser(String username, String password, String email);
    AppRole addNewRole(String role);
    void addRoleToUser(String username,String role);
    Utilisateur loadUserByUsername(String username);
    Utilisateur findById(Long Id);
    List<Utilisateur> getAllSuppliers();
    List<Utilisateur> getAllClients();
    void updatePassword(String email,String newPassword);
    void renitiliaserPassword(String email,String tempPassword);
    void verifyResetCode(String email,String password,String code);
    boolean verifyExistenceOfUsername(String username);
    void saveTempUser(String username, String email, String password, String verificationCode);
    Utilisateur verifyRegisterCode(String email, String code, String username, String password);
}
