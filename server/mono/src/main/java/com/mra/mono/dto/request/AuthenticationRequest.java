package com.mra.mono.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationRequest {

    @NotNull(message = "email is not null")
    private String email;

    @NotNull(message = "password is not null")
    String password;
}
