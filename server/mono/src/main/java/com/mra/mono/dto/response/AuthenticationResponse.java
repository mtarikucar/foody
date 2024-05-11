package com.mra.mono.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mra.mono.dto.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {

    @JsonProperty("user")
    private UUID user;
    @JsonProperty("company")
    private UUID companyId;
    @JsonProperty("logo")
    private String logo;
    @JsonProperty("role")
    private Role role;
    @JsonProperty("branch")
    private UUID branchId;
    @JsonProperty("package")
    private UUID packageId;
    @JsonProperty("access_token")
    private String accessToken;
    @JsonProperty("refresh_token")
    private String refreshToken;
}
