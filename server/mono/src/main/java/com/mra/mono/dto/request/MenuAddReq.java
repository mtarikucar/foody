package com.mra.mono.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.util.UUID;

@Data
public class MenuAddReq implements Serializable {

    @NotNull(message = "menuName is not null")
    private UUID companyId;

    @NotNull(message = "menuName is not null")
    private String menuName;

    @NotNull(message = "color is not null")
    private String color;
}
