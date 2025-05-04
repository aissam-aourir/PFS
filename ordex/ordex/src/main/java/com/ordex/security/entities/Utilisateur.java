package com.ordex.security.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ordex.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity @Data @NoArgsConstructor @AllArgsConstructor
@Table(name = "users")
@Builder
public class Utilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    @Column(unique = true)
    private String username;
    private String password;
    private String email;
    private  LocalDateTime createdAt;
    private boolean blocked;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles", // custom join table name
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "userId"),
            inverseJoinColumns = @JoinColumn(name = "role_name", referencedColumnName = "role")
    )
    @JsonIgnore
    private List<AppRole> roles;
}
