package com.sohair.moneymanager.controller;

import com.sohair.moneymanager.dto.FilterDTO;
import com.sohair.moneymanager.service.ExpenseService;
import com.sohair.moneymanager.service.IncomeService;
import com.sohair.moneymanager.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/filters")
@RequiredArgsConstructor
public class FitlerController {

    private final ProfileService profileService;
    private final IncomeService incomeService;
    private final ExpenseService expenseService;

    @PostMapping("/filter")
    public ResponseEntity<List<?>> getAllFilters(@RequestBody FilterDTO filterDTO) {
        LocalDate startDate = filterDTO.getStartDate() != null ? filterDTO.getStartDate() : LocalDate.MIN;
        LocalDate endDate = filterDTO.getEndDate() != null ? filterDTO.getEndDate() : LocalDate.now();
        String keyword = filterDTO.getKeyword() != null ? filterDTO.getKeyword() : "";
        Sort sort = filterDTO.getSortBy() != null ? Sort.by(filterDTO.getSortBy()) : Sort.by("date");
        if ("asc".equalsIgnoreCase(filterDTO.getSortOrder())) {
            sort = sort.ascending();
        } else {
            sort = sort.descending();
        }
        List<?> results = null;
        if("income".equalsIgnoreCase(filterDTO.getType())){
            results = incomeService.filterIncome(startDate, endDate, keyword, sort);
        }
        else{
            results = expenseService.filterExpenses(startDate, endDate, keyword, sort);
        }
        return ResponseEntity.ok(results);
    }
}
