package com.sohair.moneymanager.controller;

import com.sohair.moneymanager.dto.IncomeDTO;
import com.sohair.moneymanager.service.IncomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/incomes")
public class IncomeController {

    public final IncomeService incomeService;

    @PostMapping
    public ResponseEntity<IncomeDTO> addExpense(@RequestBody IncomeDTO incomeDTO) {
        incomeService.addIncome(incomeDTO);
        return ResponseEntity.ok(incomeDTO);
    }

    @GetMapping
    public ResponseEntity<List<IncomeDTO>> getAllIncomes() {
        List<IncomeDTO> incomes = incomeService.getCurrentMonthExpensesFromCurrentUser();
        return ResponseEntity.ok(incomes);
    }

    @DeleteMapping
    public ResponseEntity<String> deleteIncome(@RequestParam Long incomeId) {
        incomeService.deleteIncome(incomeId);
        return ResponseEntity.ok("Income deleted successfully");
    }

}
