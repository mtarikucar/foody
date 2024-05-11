package com.mra.mono.repository;

import com.mra.mono.dto.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CompanyRepository extends JpaRepository<Company, UUID> {
    List<Company> findAllByUserId(UUID userId);

    @Override
    Optional<Company> findById(UUID uuid);
}