package com.ordex.services.interfaces;

import com.ordex.entities.Category;
import com.ordex.helpers.CategoryDetailsDTO;

import java.util.List;

public interface ICategoryService extends ICrudBaseService<Category, Long> {
    List<CategoryDetailsDTO> getAllCategoryDetails();
    Category createWithSupplier(Category category, String supplierId);
    public List<Category> getCategoriesBySupplier(Long supplierId);
}