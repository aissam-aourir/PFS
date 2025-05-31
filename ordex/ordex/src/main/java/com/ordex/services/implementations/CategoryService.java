package com.ordex.services.implementations;

import com.ordex.entities.Category;
import com.ordex.helpers.CategoryDetailsDTO;
import com.ordex.repository.CategoryRepository;
import com.ordex.repository.ProductRepository;
import com.ordex.security.repository.UtilisateurRepository;
import com.ordex.services.interfaces.ICategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService implements ICategoryService {

    private final CategoryRepository categoryRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ProductRepository productRepository;

    @Override
    public Category save(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public Category update(Long id, Category category) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        existing.setName(category.getName());
        if (category.getUser() != null) {
            existing.setUser(category.getUser());
        }
        return categoryRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        categoryRepository.deleteById(id);
    }

    @Override
    public Category getById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    @Override
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    @Override
    public List<CategoryDetailsDTO> getAllCategoryDetails() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream().map(category -> {
            CategoryDetailsDTO dto = new CategoryDetailsDTO();
            dto.setId(category.getId());
            dto.setName(category.getName());
            if (category.getUser() != null) {
                dto.setFournisseurName(category.getUser().getUsername());
            } else {
                dto.setFournisseurName("Non assigné");
            }
            dto.setProductCount(productRepository.countByCategoryId(category.getId()));
            return dto;
        }).collect(Collectors.toList());
    }
}