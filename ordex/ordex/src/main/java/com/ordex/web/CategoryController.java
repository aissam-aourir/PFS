package com.ordex.web;

import com.ordex.entities.Category;
import com.ordex.helpers.CategoryDetailsDTO;
import com.ordex.services.implementations.CategoryService;
import com.ordex.services.interfaces.ICategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/categories")  // URL specific to categories
@RequiredArgsConstructor
public class CategoryController extends AbstractCrudController<Category, Long> {

    private final ICategoryService categoryService;

    @Override
    protected ICategoryService getService() {
        return categoryService;
    }

    @GetMapping("/details")
    public ResponseEntity<List<CategoryDetailsDTO>> getCategoryDetails() {
        List<CategoryDetailsDTO> details = categoryService.getAllCategoryDetails();
        return ResponseEntity.ok(details);
    }

    //je veux creer annotation pour faire passer deux attributs username et name





}
