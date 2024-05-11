package com.mra.mono.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
public class FeatureAddReq implements Serializable {


    @NotNull(message = "name is not null")
    private String name;

    @NotNull(message = "companyId is not null")
    private UUID companyId;
}
