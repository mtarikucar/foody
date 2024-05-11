package com.mra.mono.repository;

import com.mra.mono.dto.entity.CompanyPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CompanyPackageRepository extends JpaRepository<CompanyPackage, UUID> {

    List<CompanyPackage> findAllByCompanyId(UUID companyId);

    Optional<CompanyPackage> findByCompanyId(UUID companyId);

}
