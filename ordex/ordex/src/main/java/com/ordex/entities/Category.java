package com.ordex.entities;

import com.ordex.security.entities.Utilisateur;
import jakarta.persistence.*;
import lombok.*;
import com.ordex.security.entities.Favoris;
import java.util.List;
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity

@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    //je veux meme qu'il y a un champ pour les favoris , car une categorie peut etre apparetenat a plusieurs ligne sde tables favoris , on doit mettre un champ pour les favoris
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Favoris> favoris;
    //c'est ajoutee pour que dans le dasjbord je fais ajouter un un attribut
    // pour mentionner le supplier qu'il a cree une telle category
    @OneToOne
    private Utilisateur user;
}
