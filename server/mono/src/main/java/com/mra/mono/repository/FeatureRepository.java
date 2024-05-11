package com.mra.mono.repository;

import com.mra.mono.dto.entity.Feature;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FeatureRepository extends JpaRepository<Feature, UUID> {
    List<Feature> findAllByCompanyId(Optional<UUID> companyId);
}
