package com.sohair.moneymanager.service;

import com.sohair.moneymanager.dto.ExpenseDTO;
import com.sohair.moneymanager.entity.CategoryEntity;
import com.sohair.moneymanager.entity.ExpenseEntity;
import com.sohair.moneymanager.entity.ProfileEntity;
import com.sohair.moneymanager.repository.CategoryRepository;
import com.sohair.moneymanager.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ProfileService profileService;
    private final CategoryRepository categoryRepository;

    public ExpenseDTO addExpense(ExpenseDTO dto){
        ProfileEntity profile = profileService.getCurrentProfile();
        CategoryEntity category = categoryRepository.findByIdAndProfile_Id(dto.getCategoryId(), profile.getId())
                .orElseThrow(() -> new RuntimeException("Category not found!"));
        ExpenseEntity entity = toEntity(dto, profile, category);
        entity = expenseRepository.save(entity);
        return toDTO(entity);
    }

    public List<ExpenseDTO> getCurrentMonthExpensesFromCurrentUser(){
        ProfileEntity profile = profileService.getCurrentProfile();
        LocalDate now = LocalDate.now();
        LocalDate start = now.withDayOfMonth(1);
        LocalDate end = now.withDayOfMonth(now.lengthOfMonth());
        List<ExpenseEntity> entities = expenseRepository.findByProfile_IdAndDateBetween(profile.getId(), start, end);
        return entities.stream().map(this::toDTO).toList();
    }

    public List<ExpenseDTO> getLatest5ExpensesForCurrentUser(){
        ProfileEntity profile = profileService.getCurrentProfile();
        List<ExpenseEntity> expenses = expenseRepository.findTop5ByProfile_IdOrderByDateDesc(profile.getId());
        return expenses.stream().map(this::toDTO).toList();
    }

    public BigDecimal getTotalExpense(){
        ProfileEntity profile = profileService.getCurrentProfile();
        BigDecimal total = expenseRepository.findTotalExpensesByProfileId(profile.getId());
        return total != null ? total : BigDecimal.ZERO;
    }

    public ExpenseDTO deleteExpense(Long expenseId){
        ProfileEntity profile = profileService.getCurrentProfile();
        ExpenseEntity entity = expenseRepository.findByIdAndProfile_Id(expenseId, profile.getId())
                .orElseThrow(() -> new RuntimeException("Expense not found!"));
        expenseRepository.delete(entity);
        return toDTO(entity);
    }

    //Filters
    public List<ExpenseDTO> filterExpenses(LocalDate startDate, LocalDate endDate, String keyword, Sort sort){
        ProfileEntity profile = profileService.getCurrentProfile();
        List<ExpenseEntity> entities = expenseRepository.findByProfile_IdAndDateBetweenAndNameContainingIgnoreCase(profile.getId(), startDate, endDate, keyword, sort);
        return entities.stream().map(this::toDTO).toList();
    }

    //Notification
    public List<ExpenseDTO> getExpenses(Long profileId, LocalDate date ){
        List<ExpenseEntity> entities = expenseRepository.findByProfile_IdAndDate(profileId, date);
        return entities.stream().map(this::toDTO).toList();
    }

    public ExpenseDTO toDTO(ExpenseEntity entity){
        return ExpenseDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .amount(entity.getAmount())
                .date(entity.getDate())
                .icon(entity.getIcon())
                .categoryId(entity.getCategory().getId())
                .profileId(entity.getProfile().getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public ExpenseEntity toEntity(ExpenseDTO dto, ProfileEntity profileEntity, CategoryEntity categoryEntity){
        return ExpenseEntity.builder()
                .id(dto.getId())
                .name(dto.getName())
                .amount(dto.getAmount())
                .date(dto.getDate())
                .category(categoryEntity)
                .profile(profileEntity)
                .icon(dto.getIcon())
                .createdAt(dto.getCreatedAt())
                .updatedAt(dto.getUpdatedAt())
                .build();
    }

    public List<ExpenseDTO> getExpensesFromUserOnDate(Long profileId, LocalDate date){
        List<ExpenseEntity> entities = expenseRepository.findByProfile_IdAndDate(profileId, date);
        return entities.stream().map(this::toDTO).toList();
    }
}
