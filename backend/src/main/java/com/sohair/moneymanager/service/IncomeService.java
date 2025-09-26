package com.sohair.moneymanager.service;

import com.sohair.moneymanager.dto.ExpenseDTO;
import com.sohair.moneymanager.dto.IncomeDTO;
import com.sohair.moneymanager.entity.CategoryEntity;
import com.sohair.moneymanager.entity.ExpenseEntity;
import com.sohair.moneymanager.entity.IncomeEntity;
import com.sohair.moneymanager.entity.ProfileEntity;
import com.sohair.moneymanager.repository.CategoryRepository;
import com.sohair.moneymanager.repository.IncomeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IncomeService {

    private final IncomeRepository incomeRepository;
    private final ProfileService profileService;
    private final CategoryRepository categoryRepository;

    public IncomeDTO addIncome(IncomeDTO dto){
        ProfileEntity profile = profileService.getCurrentProfile();
        CategoryEntity category = categoryRepository.findByIdAndProfile_Id(dto.getCategoryId(), profile.getId())
                .orElseThrow(() -> new RuntimeException("Category not found!"));
        IncomeEntity entity = toEntity(dto, profile, category);
        entity = incomeRepository.save(entity);
        return toDTO(entity);
    }

    public List<IncomeDTO> getCurrentMonthExpensesFromCurrentUser(){
        ProfileEntity profile = profileService.getCurrentProfile();
        LocalDate now = LocalDate.now();
        LocalDate start = now.withDayOfMonth(1);
        LocalDate end = now.withDayOfMonth(now.lengthOfMonth());
        List<IncomeEntity> entities = incomeRepository.findByProfile_IdAndDateBetween(profile.getId(), start, end);
        return entities.stream().map(this::toDTO).toList();
    }

    public List<IncomeDTO> getLatest5IncomesForCurrentUser(){
        ProfileEntity profile = profileService.getCurrentProfile();
        List<IncomeEntity> incomes = incomeRepository.findTop5ByProfile_IdOrderByDateDesc(profile.getId());
        return incomes.stream().map(this::toDTO).toList();
    }

    public BigDecimal getTotalIncome(){
        ProfileEntity profile = profileService.getCurrentProfile();
        BigDecimal total = incomeRepository.findTotalIncomesByProfileId(profile.getId());
        return total != null ? total : BigDecimal.ZERO;
    }

    public IncomeDTO deleteIncome(Long incomeId){
        ProfileEntity profile = profileService.getCurrentProfile();
        IncomeEntity entity = incomeRepository.findByIdAndProfile_Id(incomeId, profile.getId())
                .orElseThrow(() -> new RuntimeException("Income not found!"));
        incomeRepository.delete(entity);
        return toDTO(entity);
    }

    //Filters
    public List<IncomeDTO> filterIncome(LocalDate startDate, LocalDate endDate, String keyword, Sort sort){
        ProfileEntity profile = profileService.getCurrentProfile();
        List<IncomeEntity> entities = incomeRepository.findByProfile_IdAndDateBetweenAndNameContainingIgnoreCase(profile.getId(), startDate, endDate, keyword, sort);
        return entities.stream().map(this::toDTO).toList();
    }

    //Notification
    public List<IncomeDTO> getIncomesByDate(LocalDate date){
        List<IncomeEntity> entities = incomeRepository.findByProfile_IdAndDate(profileService.getCurrentProfile().getId(), date);
        return entities.stream().map(this::toDTO).toList();
    }

    public IncomeDTO toDTO(IncomeEntity entity){
        return IncomeDTO.builder()
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

    public IncomeEntity toEntity(IncomeDTO dto, ProfileEntity profileEntity, CategoryEntity categoryEntity){
        return IncomeEntity.builder()
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
}
