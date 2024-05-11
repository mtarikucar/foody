package com.mra.mono.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ChangePasswordRequestWithOtp {

    @NotNull(message = "Otp is not null")
    private String otp;

    @NotNull(message = "email is not null")
    private String email;

    @NotNull(message = "newPassword is not null")
    private String newPassword;

    @NotNull(message = "confirmationPassword is not null")
    private String confirmationPassword;
}
