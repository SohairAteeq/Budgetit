package com.sohair.moneymanager.service;

import com.sohair.moneymanager.dto.ExpenseDTO;
import com.sohair.moneymanager.dto.IncomeDTO;
import com.sohair.moneymanager.dto.RecentTransactionDTO;
import com.sohair.moneymanager.entity.ProfileEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final ProfileService profileService;
    private final IncomeService incomeService;
    private final ExpenseService expenseService;

    public Map<String, Object> getDashboardData(){
        Map<String, Object> returnData = new LinkedHashMap<>();

        ProfileEntity profile = profileService.getCurrentProfile();
        List<IncomeDTO> recentIncomes = incomeService.getLatest5IncomesForCurrentUser();
        List<ExpenseDTO> recentExpenses = expenseService.getLatest5ExpensesForCurrentUser();

        // Convert incomes → RecentTransactionDTO
        List<RecentTransactionDTO> incomeTransactions = recentIncomes.stream()
                .map(income -> RecentTransactionDTO.builder()
                        .id(income.getId())
                        .name(income.getName())
                        .icon(income.getIcon())
                        .amount(income.getAmount())
                        .date(income.getDate())
                        .createdAt(income.getCreatedAt())
                        .updatedAt(income.getUpdatedAt())
                        .type("INCOME")
                        .build())
                .toList();

        // Convert expenses → RecentTransactionDTO
        List<RecentTransactionDTO> expenseTransactions = recentExpenses.stream()
                .map(expense -> RecentTransactionDTO.builder()
                        .id(expense.getId())
                        .name(expense.getName())
                        .icon(expense.getIcon())
                        .amount(expense.getAmount())
                        .date(expense.getDate())
                        .createdAt(expense.getCreatedAt())
                        .updatedAt(expense.getUpdatedAt())
                        .type("EXPENSE")
                        .build())
                .toList();
        // Combine incomes + expenses
        List<RecentTransactionDTO> transactions = new ArrayList<>();
        transactions.addAll(incomeTransactions);
        transactions.addAll(expenseTransactions);

        // Sort by createdAt (latest first)
        transactions.sort((t1, t2) -> t2.getCreatedAt().compareTo(t1.getCreatedAt()));

        // Put into your return map
        returnData.put("latestTransactions", transactions);

        returnData.put("balance", incomeService.getTotalIncome().subtract(expenseService.getTotalExpense()));
        returnData.put("totalIncome", incomeService.getTotalIncome());
        returnData.put("totalExpense", expenseService.getTotalExpense());
        returnData.put("last5Incomes", recentIncomes);
        returnData.put("last5Expenses", recentExpenses);

        return returnData;
    }
}
