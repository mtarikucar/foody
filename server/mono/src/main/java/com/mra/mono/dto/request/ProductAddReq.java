package com.mra.mono.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
public class ProductAddReq implements Serializable {


    @NotNull(message = "categoryId is not null")
    private UUID categoryId;

    @NotNull(message = "companyId is not null")
    private UUID companyId;

    @NotNull(message = "name is not null")
    private String name;

    @NotNull(message = "price is not null")
    private Double price;

    @NotNull(message = "image is not null")
    private List<String> images;

    @NotNull(message = "ratings is not null")
    private Integer ratings;

    @NotNull(message = "description is not null")
    private String description;

    @NotNull(message = "ratings is not null")
    private Set<UUID> featureIds;
}
