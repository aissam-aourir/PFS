package com.ordex.security.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ordex.enums.Role;
import jakarta.persistence.*;
import lombok.*;
//importer la classe Favoris de folder security
import lombok.experimental.SuperBuilder;
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
    private String phone;
    private  LocalDateTime createdAt;
    private boolean blocked;
    private String tem_password=null;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles", // custom join table name
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "userId"),
            inverseJoinColumns = @JoinColumn(name = "role_name", referencedColumnName = "role")
    )
    @JsonIgnore
    private List<AppRole> roles;
    //un user qui est un client peut avoir plusieurs favoris et un favoris peut etre appartenant a plusieurs utilisateurs
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Favoris> favoris;
     //je viens de creer une enumeration contennat deux cas Actif et Inactif sous le nom de status
     //et pour chaque user je vais lui attribuer un status
     //mais pas maintennat c'est apres

}
