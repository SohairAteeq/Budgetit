package com.sohair.moneymanager.repository;

import com.sohair.moneymanager.entity.ExpenseEntity;
import com.sohair.moneymanager.entity.IncomeEntity;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface IncomeRepository extends JpaRepository<IncomeEntity, Long> {

    Optional<IncomeEntity> findByIdAndProfile_Id(Long id, Long profileId);

    List<IncomeEntity> findByProfile_IdOrderByDateDesc(Long profileId);

    List<IncomeEntity> findTop5ByProfile_IdOrderByDateDesc(Long profileId);

    @Query("SELECT SUM(e.amount) FROM IncomeEntity e WHERE e.profile.id = :profileId")
    BigDecimal findTotalIncomesByProfileId(Long profileId);

    List<IncomeEntity> findByProfile_IdAndDateBetweenAndNameContainingIgnoreCase(Long profile_id, LocalDate startDate, LocalDate endDate, String keyword, Sort sort);

    List<IncomeEntity> findByProfile_IdAndDateBetween(Long profile_id, LocalDate startDate, LocalDate endDate);

    List<IncomeEntity> findByProfile_IdAndDate(Long id, LocalDate date);
}
