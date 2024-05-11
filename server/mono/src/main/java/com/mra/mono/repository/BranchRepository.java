package com.mra.mono.repository;

import com.mra.mono.dto.entity.Branch;
import com.mra.mono.dto.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BranchRepository extends JpaRepository<Branch, UUID> {
    List<Branch> findAllByCompanyId(Optional<UUID> companyId);

}
