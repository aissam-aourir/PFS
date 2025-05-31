package com.ordex.services.interfaces;

import com.ordex.entities.Category;
import com.ordex.helpers.CategoryDetailsDTO;

import java.util.List;

public interface ICategoryService extends ICrudBaseService<Category, Long>{
    // Add extra methods specific to Category if needed
    //retourner un le nombre de sproduits par category
//    Long countProductsByCategoryId(int categoryId);
//une methdoede getCategoryDetails
     List<CategoryDetailsDTO> getAllCategoryDetails();
}
