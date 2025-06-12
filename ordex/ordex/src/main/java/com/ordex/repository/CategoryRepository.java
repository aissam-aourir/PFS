package com.ordex.repository;

import com.ordex.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    //retourner le nombre des produits par categori
//    Long countProductsById(Long id);
    @Query("SELECT c FROM Category c WHERE c.user.userId = :supplierId")
    List<Category> findByUserId(Long supplierId);
}
