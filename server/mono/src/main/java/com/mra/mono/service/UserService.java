package com.mra.mono.service;

import com.mra.mono.common.exception.ResourceNotFoundException;
import com.mra.mono.dto.request.ChangePasswordRequest;
import com.mra.mono.dto.entity.Users;
import com.mra.mono.dto.request.ChangePasswordRequestWithOtp;
import com.mra.mono.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public void changePassword(ChangePasswordRequest request, Principal connectedUser) {
        try {
            var user = (Users) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

            // check if the current password is correct
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new IllegalStateException("Wrong password");
            }
            // check if the two new passwords are the same
            if (!request.getNewPassword().equals(request.getConfirmationPassword())) {
                throw new IllegalStateException("Passwords are not the same");
            }

            // update the password
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));

            // save the new password
            userRepository.save(user);
        } catch (IllegalStateException e) {
            log.error("Error changing password: ", e);
            throw e; // Re-throw the exception if it's a known and managed case
        } catch (Exception e) {
            log.error("Error during the password change process", e);
            throw new RuntimeException("An error occurred during the password change process", e);
        }
    }

    public void changePassword(ChangePasswordRequestWithOtp request) {
        try {
            var user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + request.getEmail()));

            // check if the two new passwords are the same
            if (!request.getNewPassword().equals(request.getConfirmationPassword())) {
                throw new IllegalStateException("Passwords are not the same");
            }

            user.setPassword(passwordEncoder.encode(request.getNewPassword()));

            // save the new password
            userRepository.save(user);
        } catch (IllegalStateException e) {
            log.error("Error changing password: ", e);
            throw e; // Re-throw the exception if it's a known and managed case
        } catch (Exception e) {
            log.error("Error during the password change process", e);
            throw new RuntimeException("An error occurred during the password change process", e);
        }
    }



    public Boolean updateCompanyId(UUID companyId , UUID userId) {
        try {
            Users users = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + userId));
            users.setCompanyId(companyId);
           userRepository.save(users);
           return true;
        } catch (Exception e) {
            log.error("Error updating User with id: {}", userId, e);
            throw e;
        }
    }

    public Optional<Users> getUserById(UUID userId) {
        return userRepository.findById(userId);
    }

    public List<Users> getUserByCompanyId(UUID companyId){
        return userRepository.findAllByCompanyId(companyId);
    }

    public Users save(Users user) {
        try {

            return userRepository.save(user);
        } catch (Exception e) {
            log.error("Error while saving product category", e);
            throw e;
        }
    }

    public List<Users> getUserByCompanyAndBranchId(UUID companyId, UUID branchId) {
        return userRepository.findAllByCompanyIdAndBranchId(companyId,branchId);
    }

    public void changeUserStatus(UUID id, boolean status) {
        try {
            Users user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + id));
            user.setActive(status);
            userRepository.save(user);
        } catch (Exception e) {
            log.error("Error updating User with id: {}", id, e);
            throw e;
        }
    }
}
