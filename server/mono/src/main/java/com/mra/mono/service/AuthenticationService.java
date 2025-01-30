package com.mra.mono.service;

import com.mra.mono.common.controller.BaseController;
import com.mra.mono.common.exception.HandledException;
import com.mra.mono.dto.entity.Role;
import com.mra.mono.dto.request.RegisterRequest;
import com.mra.mono.dto.entity.Token;
import com.mra.mono.repository.CompanyPackageRepository;
import com.mra.mono.repository.CompanyRepository;
import com.mra.mono.repository.TokenRepository;
import com.mra.mono.dto.entity.TokenType;
import com.mra.mono.config.JwtService;
import com.mra.mono.dto.entity.Users;
import com.mra.mono.dto.request.AuthenticationRequest;
import com.mra.mono.dto.response.AuthenticationResponse;
import com.mra.mono.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.micrometer.core.ipc.http.HttpSender;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final CompanyPackageRepository companyPackageRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) throws HandledException {
        // E-posta adresi kontrolü
        log.info("Registering user with email: {}", request.getEmail());
        Optional<Users> existingUser = userRepository.findByEmail(request.getEmail());

        if (existingUser.isPresent()) {
            log.error("Registration failed: Email {} is already in use", request.getEmail());
            throw new HandledException(400,"Bu e-posta adresiyle zaten bir hesap kayıtlı.");
        }

        var user = Users.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Optional.ofNullable(request.getRole()).orElse(Role.ADMIN))
                .phoneNumber(request.getPhoneNumber())
                .companyId(request.getCompanyId())
                .branchId(request.getBranchId())
                .createTime(new Date())
                .lastLoginDate(new Date())
                .build();

        var savedUser = userRepository.save(user);
        log.info("User registered with email: {}", request.getEmail());

        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        saveUserToken(savedUser, jwtToken);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .companyId(savedUser.getCompanyId())
                .branchId(savedUser.getBranchId())
                .refreshToken(refreshToken)
                .user(savedUser.getUserId())
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) throws HandledException{
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
            var user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new HandledException(404,"Bu Email için kullanıcı bulunamadı: " + request.getEmail()));

            if (!user.isActive()) {
                throw new HandledException(400,"Kullanıcı aktif değil");
            }

            var jwtToken = jwtService.generateToken(user);
            var refreshToken = jwtService.generateRefreshToken(user);
            revokeAllUserTokens(user);
            saveUserToken(user, jwtToken);

            String logo = null;
            UUID packageId = null;
            if (user.getCompanyId() != null) {
                var company = companyRepository.findById(user.getCompanyId()).orElse(null);
                if (company != null) {
                    logo = company.getLogo();
                }
                var companyPackage = companyPackageRepository.findByCompanyId(user.getCompanyId());
                if (companyPackage.isPresent()) {
                    packageId = companyPackage.get().getPackageId();
                }
            }

            return AuthenticationResponse.builder()
                    .user(user.getUserId())
                    .role(user.getRole())
                    .packageId(packageId)
                    .companyId(user.getCompanyId())
                    .branchId(user.getBranchId())
                    .logo(logo)
                    .accessToken(jwtToken)
                    .refreshToken(refreshToken)
                    .build();
        } catch (Exception e) {
            log.error("Error during authentication: ", e);
            throw new HandledException(400,"Kullanıcı adı veta şifre hatalı");
        }
    }

    private void saveUserToken(Users user, String jwtToken) {
        var token = Token.builder()
                .userId(user.getUserId())
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(Users user) {
        var validUserTokens = tokenRepository.findAByUserId(user.getUserId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }


    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException  {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.info("Authorization header is missing or does not start with Bearer");
            return;
        }

        refreshToken = authHeader.substring(7);
        userEmail = jwtService.extractUsername(refreshToken);

        if (userEmail != null) {
            var user = this.userRepository.findByEmail(userEmail).orElseThrow();

            if (jwtService.isTokenValid(refreshToken, user)) {
                var accessToken = jwtService.generateToken(user);
                revokeAllUserTokens(user);
                saveUserToken(user, accessToken);

                var authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .build();

                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
                log.info("Token refreshed successfully for user: {}", userEmail);
            } else {
                log.info("Invalid refresh token for user: {}", userEmail);
            }
        } else {
            log.info("User email not found in refresh token");
        }
    }
}
