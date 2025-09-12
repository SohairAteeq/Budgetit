package com.sohair.moneymanager.controller;

import com.sohair.moneymanager.dto.CategoryDTO;
import com.sohair.moneymanager.entity.CategoryEntity;
import com.sohair.moneymanager.entity.ProfileEntity;
import com.sohair.moneymanager.service.CategoryService;
import com.sohair.moneymanager.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    @Autowired
    CategoryService categoryService;

    @Autowired
    ProfileService profileService;

    @PostMapping
    public ResponseEntity<CategoryDTO> saveCategory(@RequestBody CategoryDTO categoryDTO) {
        ProfileEntity profile = profileService.getCurrentProfile(SecurityContextHolder.getContext().getAuthentication().getName());
        categoryService.saveCategory(categoryDTO, profile);
        return new ResponseEntity<>(categoryDTO, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getCategoriesForCurrentProfile() {
        return ResponseEntity.ok(categoryService.getCategoriesForCurrentProfile());
    }

    @GetMapping("/{type}")
    public ResponseEntity<?> getCategoriesByTypeForCurrentProfile(@PathVariable String type) {
        return ResponseEntity.ok(categoryService.getCategoriesByTypeForCurrentProfile(type));
    }

    @PutMapping("/{categoryId}")
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable Long categoryId, @RequestBody CategoryDTO categoryDTO){
        CategoryDTO updatedCategory = categoryService.updateCategory(categoryId, categoryDTO);
        return ResponseEntity.ok(updatedCategory);
    }
}
