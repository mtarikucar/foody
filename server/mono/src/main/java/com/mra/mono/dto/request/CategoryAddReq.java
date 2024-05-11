package com.mra.mono.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.util.UUID;

@Data
public class CategoryAddReq implements Serializable {

    @NotBlank(message = "name is not null")
    private String name;

    @NotBlank(message = "image is not null")
    private String image;

    @NotNull(message = "companyId is not null")
    private UUID companyId;
}
