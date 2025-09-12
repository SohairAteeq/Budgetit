package com.sohair.moneymanager.controller;

import com.sohair.moneymanager.dto.ExpenseDTO;
import com.sohair.moneymanager.dto.IncomeDTO;
import com.sohair.moneymanager.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/expenses")
public class ExpenseController {

    public final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ExpenseDTO> addExpense(@RequestBody ExpenseDTO expenseDTO) {
        expenseService.addExpense(expenseDTO);
        return ResponseEntity.ok(expenseDTO);
    }

    @GetMapping
    public ResponseEntity<List<ExpenseDTO>> getAllExpenses() {
        List<ExpenseDTO> expenses = expenseService.getCurrentMonthExpensesFromCurrentUser();
        return ResponseEntity.ok(expenses);
    }

    @DeleteMapping
    public ResponseEntity<String> deleteExpense(@RequestParam Long expenseId) {
        expenseService.deleteExpense(expenseId);
        return ResponseEntity.ok("Expense deleted successfully");
    }

}
