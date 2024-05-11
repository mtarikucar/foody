package com.mra.mono.dto.request;

import com.mra.mono.dto.entity.Role;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {


    @NotNull(message = "firstName is not null")
    private String firstName;

    @NotNull(message = "lastName is not null")
    private String lastName;

    @NotNull(message = "email is not null")
    private String email;

    @NotNull(message = "phoneNumber is not null")
    private String phoneNumber;

    @NotNull(message = "password is not null")
    private String password;

    @NotNull(message = "role is not null")
    private Role role;

    private UUID CompanyId;
}
