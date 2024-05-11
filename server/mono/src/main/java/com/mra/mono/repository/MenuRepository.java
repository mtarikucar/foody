package com.mra.mono.repository;


import com.mra.mono.dto.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MenuRepository extends JpaRepository<Menu, UUID> {
    List<Menu> findAllByCompanyId(Optional<UUID> companyId);
}