package com.mra.mono.repository;

import com.mra.mono.dto.entity.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RegionRepository extends JpaRepository<Region, UUID> {

    List<Region> findRegionByBranchId(UUID branchId);
}
