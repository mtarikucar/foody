package com.mra.mono.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.mra.mono.dto.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenRepository extends JpaRepository<Token, Integer> {

    List<Token> findAByUserId(UUID userId);

    Optional<Token> findByToken(String token);
}
