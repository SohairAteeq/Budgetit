package com.sohair.moneymanager.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ExpenseDTO {
    private int id;
    private String name;
    private String icon;
    private BigDecimal amount;
    private LocalDate date;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private long categoryId;
    private long profileId;
}
