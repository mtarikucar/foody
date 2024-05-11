package com.mra.mono.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Date;
import java.util.UUID;

@Data
public class CompanyReq {

    @NotNull(message = "name is not null")
    private String name;

    private String logo;

    @NotNull(message = "userId is not null")
    private UUID userId;

    private String type;

    private String phone;

    private String mail;

    private Integer headCount;
}
