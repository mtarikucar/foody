package com.mra.mono.controller;

import com.mra.mono.common.controller.BaseController;
import com.mra.mono.common.exception.ResourceNotFoundException;
import com.mra.mono.dto.entity.Users;
import com.mra.mono.dto.entity.message.Message;
import com.mra.mono.dto.request.ChangePasswordRequest;
import com.mra.mono.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
@Slf4j
@RequiredArgsConstructor
public class UserController extends BaseController {

    private final UserService service;


    @GetMapping("/{id}")
    public ResponseEntity<Message<Users>> getUser(@PathVariable UUID id, Principal connectedUser) {
        try {
            Users user = service.getUserById(id).orElseThrow(() -> {
                log.error("Users not found with ID: {}", id);
                return new ResourceNotFoundException("Users not found with id: " + id);
            });
            return buildSuccessReturnEntity(user);
        } catch (Exception e) {
            log.error("Error while fetching user", e);
            return buildFailureReturnEntity("Error fetching user: " + e.getMessage());
        }
    }

    ;

    @GetMapping
    public ResponseEntity<Message<List<Users>>> getUsers(@RequestParam UUID companyId,
                                                         @RequestParam(required = false) UUID branchId) {
        try {
            List<Users> users;
            if (branchId != null) {
                users = service.getUserByCompanyAndBranchId(companyId, branchId);
            } else {
                users = service.getUserByCompanyId(companyId);
            }
            return buildSuccessReturnEntity(users);
        } catch (Exception e) {
            log.error("Error while fetching users", e);
            return buildFailureReturnEntity("Error fetching users: " + e.getMessage());
        }
    }


    @PutMapping
    public ResponseEntity<Message<String>> changePassword(
            @RequestBody ChangePasswordRequest request,
            Principal connectedUser
    ) {
        service.changePassword(request, connectedUser);
        return ResponseEntity.ok().build();
    }

}
