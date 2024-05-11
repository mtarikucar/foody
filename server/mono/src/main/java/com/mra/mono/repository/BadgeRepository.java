package com.mra.mono.repository;

import com.mra.mono.dto.entity.Badge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BadgeRepository extends JpaRepository<Badge, UUID> {}