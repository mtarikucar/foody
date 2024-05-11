package com.mra.mono.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ChangePasswordRequest {

    @NotNull(message = "currentPassword is not null")
    private String currentPassword;

    @NotNull(message = "newPassword is not null")
    private String newPassword;

    @NotNull(message = "confirmationPassword is not null")
    private String confirmationPassword;
}
