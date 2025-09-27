package com.sohair.moneymanager.service;

import com.sohair.moneymanager.dto.CategoryDTO;
import com.sohair.moneymanager.entity.CategoryEntity;
import com.sohair.moneymanager.entity.ProfileEntity;
import com.sohair.moneymanager.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    ProfileService profileService;

    @Autowired
    CategoryRepository categoryRepository;

    public CategoryDTO saveCategory(CategoryDTO categoryDTO, ProfileEntity profile){
        if(categoryRepository.existsByNameAndProfile_Id(categoryDTO.getName(), profile.getId())){
            throw new RuntimeException("Category with name " + categoryDTO.getName() + " already exists for this profile.");
        }
        CategoryEntity categoryEntity = toEntity(categoryDTO, profile);
        categoryEntity = categoryRepository.save(categoryEntity);
        return toDTO(categoryEntity, profile);
    }

    public List<CategoryDTO> getCategoriesForCurrentProfile(){
        ProfileEntity profile = profileService.getCurrentProfile();
        List<CategoryEntity> categoryEntities = categoryRepository.findByProfile_Id(profile.getId());
        return categoryEntities.stream().map(categoryEntity -> toDTO(categoryEntity, profile)).toList();
    }

    public List<CategoryDTO> getCategoriesByTypeForCurrentProfile(String type){
        ProfileEntity profile = profileService.getCurrentProfile();
        List<CategoryEntity> categoryEntities = categoryRepository.findByTypeAndProfile_Id(type, profile.getId());
        return categoryEntities.stream().map(categoryEntity -> toDTO(categoryEntity, profile)).toList();
    }

    public CategoryDTO updateCategory(Long categoryId, CategoryDTO categoryDTO){
        ProfileEntity profile = profileService.getCurrentProfile();
        CategoryEntity currentCategory = categoryRepository.findByIdAndProfile_Id(categoryId, profile.getId())
                .orElseThrow(() -> new RuntimeException("Category not found!"));
        currentCategory.setName(categoryDTO.getName());
        currentCategory.setIcon(categoryDTO.getIcon());
        currentCategory.setType(categoryDTO.getType());
        categoryRepository.save(currentCategory);
        return toDTO(currentCategory, profile);
    }

    public CategoryDTO toDTO(CategoryEntity categoryEntity, ProfileEntity profile){
        return CategoryDTO.builder()
                .id(categoryEntity.getId())
                .name(categoryEntity.getName())
                .type(categoryEntity.getType())
                .icon(categoryEntity.getIcon())
                .profileId(profile.getId()) // take ID from ProfileEntity
                .build();
    }

    public CategoryEntity toEntity(CategoryDTO categoryDTO, ProfileEntity profile){
        return CategoryEntity.builder()
                .id(categoryDTO.getId())
                .name(categoryDTO.getName())
                .icon(categoryDTO.getIcon())
                .type(categoryDTO.getType())
                .profile(profile)
                .build();
    }
}
