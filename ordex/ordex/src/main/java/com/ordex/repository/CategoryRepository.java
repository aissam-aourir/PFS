package com.ordex.repository;

import com.ordex.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    //retourner le nombre des produits par categori
//    Long countProductsById(Long id);
}
