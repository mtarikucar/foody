package com.mra.mono.controller;

import com.mra.mono.common.exception.HandledException;
import com.mra.mono.dto.request.AuthenticationRequest;
import com.mra.mono.dto.response.AuthenticationResponse;
import com.mra.mono.service.AuthenticationService;
import com.mra.mono.dto.request.RegisterRequest;
import com.mra.mono.common.controller.BaseController;
import com.mra.mono.dto.entity.message.Message;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthenticationController extends BaseController {

    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<Message<AuthenticationResponse>> register(@RequestBody RegisterRequest request) {
        try {
            AuthenticationResponse response = service.register(request);
            log.info("Registration successful for email: {}", request.getEmail());
            return buildSuccessReturnEntity(response);
        } catch (HandledException e) {
            log.error("Registration failed for email: {}: {}", request.getEmail(), e.getMessage());
            return buildReturnEntity(e.getMessage(),e.getCode());
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<Message<AuthenticationResponse>> authenticate(@RequestBody AuthenticationRequest request) {
        try {
            AuthenticationResponse response = service.authenticate(request);
            log.info("Authentication successful for email: {}", request.getEmail());
            return buildSuccessReturnEntity(response);
        } catch (HandledException e) {
            log.error("Authentication failed for email: {}: {}", request.getEmail(), e);
            return buildReturnEntity(e.getMessage(),e.getCode());
        }
    }

    @PostMapping("/refresh-token")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            service.refreshToken(request, response);
            log.info("Token refresh successful");
        } catch (IOException e) {
            log.error("Token refresh failed: {}", e.getMessage());
            throw e; // Rethrow the IOException to be handled by the servlet container
        }
    }




}
