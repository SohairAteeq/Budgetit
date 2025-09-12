package com.sohair.moneymanager.repository;

import com.sohair.moneymanager.entity.ProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<ProfileEntity, Long> {
    Optional<ProfileEntity> findByEmail(String email);
    Optional<ProfileEntity> findByFullName(String fullName);
    // This method is used to find a profile by its activation token
    Optional<ProfileEntity> findByActivationToken(String activationToken);
}
