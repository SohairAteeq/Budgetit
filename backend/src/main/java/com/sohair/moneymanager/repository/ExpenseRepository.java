package com.sohair.moneymanager.repository;

import com.sohair.moneymanager.entity.ExpenseEntity;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseRepository extends JpaRepository<ExpenseEntity, Long> {

    Optional<ExpenseEntity> findByIdAndProfile_Id(Long id, Long profileId);

    List<ExpenseEntity> findByProfile_IdOrderByDateDesc(Long profileId);

    List<ExpenseEntity> findTop5ByProfile_IdOrderByDateDesc(Long profileId);

    @Query("SELECT SUM(e.amount) FROM ExpenseEntity e WHERE e.profile.id = :profileId")
    BigDecimal findTotalExpensesByProfileId(Long profileId);

    List<ExpenseEntity> findByProfile_IdAndDateBetweenAndNameContainingIgnoreCase(Long profile_id, LocalDate startDate, LocalDate endDate, String keyword, Sort sort);

    List<ExpenseEntity> findByProfile_IdAndDateBetween(Long profile_id, LocalDate startDate, LocalDate endDate);

    List<ExpenseEntity> findByProfile_IdAndDate(Long profileId, LocalDate date);
}
